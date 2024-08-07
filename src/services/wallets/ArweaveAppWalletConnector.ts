import { ARWEAVE_APP_API } from '@src/constants';
import { DataItem } from 'arbundles';
import { ApiConfig } from 'arweave/node/lib/api';
import { ReactiveConnector } from 'node_modules/arweave-wallet-connector/lib/browser/Reactive';

import { ArweaveAppError } from '../../../types/error';
import { executeWithTimeout } from '../../utils';
import {
  ARCONNECT_UNRESPONSIVE_ERROR,
  WALLET_TYPES,
  WalletConnector,
} from './arweave';

export class ArweaveAppWalletConnector implements WalletConnector {
  private _wallet: ReactiveConnector & { namespaces: any };
  arconnectSigner?: Window['arweaveWallet'];

  constructor() {
    this._wallet = ARWEAVE_APP_API as any;
    this.arconnectSigner = this._wallet as any;
  }

  // The API has been shown to be unreliable, so we call each function with a timeout
  async safeArconnectApiExecutor<T>(fn: () => T): Promise<T> {
    /**
     * This is here because occasionally arconnect injects but does not initialize internally properly,
     * allowing the api to be called but then hanging.
     * This is a workaround to check that and emit appropriate errors,
     * and to trigger the workaround workflow of reloading the page and re-initializing arconnect.
     */

    const res = await executeWithTimeout(() => fn(), 20_000);

    if (res === 'timeout') {
      throw new Error(ARCONNECT_UNRESPONSIVE_ERROR);
    }
    return res as T;
  }

  async connect(): Promise<string> {
    // confirm they have the extension installed
    try {
      localStorage.setItem('walletType', WALLET_TYPES.ARWEAVE_APP);

      const address = await this.getWalletAddress().catch(() => null);

      !address &&
        (await this._wallet?.connect({
          name: 'ARNS - ar.io',
        }));
      return address ?? this.getWalletAddress();
    } catch (error) {
      localStorage.removeItem('walletType');
      throw new ArweaveAppError('User cancelled authentication.');
    }
  }

  async disconnect(): Promise<void> {
    localStorage.removeItem('walletType');
    return this._wallet.disconnect();
  }

  async getWalletAddress(): Promise<string> {
    return this._wallet.namespaces.arweaveWallet.getActiveAddress();
  }

  async getGatewayConfig(): Promise<ApiConfig> {
    return {
      host: 'ar-io.dev',
      port: 443,
      protocol: 'https',
    };
  }
  async signDataItem(data: DataItem): Promise<ArrayBufferLike> {
    return (this._wallet as any).signDataItem(data);
  }

  async getActivePublicKey(): Promise<string> {
    return this._wallet.namespaces.arweaveWallet.getActivePublicKey();
  }
}
