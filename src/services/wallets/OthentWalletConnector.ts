import * as othent from '@othent/kms';
import { DEFAULT_ARWEAVE } from '@src/constants';
import { ApiConfig } from 'arweave/node/lib/api';

import { OthentError, WalletNotInstalledError } from '../../../types/error';
import { executeWithTimeout } from '../../utils';
import {
  ARCONNECT_UNRESPONSIVE_ERROR,
  WALLET_TYPES,
  WalletConnector,
} from './arweave';

export class OthentWalletConnector implements WalletConnector {
  private _wallet: typeof othent;
  arconnectSigner: Window['arweaveWallet'];
  constructor() {
    this._wallet = othent;
    this.arconnectSigner = othent as any as Window['arweaveWallet'];
  }

  // The API has been shown to be unreliable, so we call each function with a timeout
  async safeArconnectApiExecutor<T>(fn: () => T): Promise<T> {
    if (!this._wallet)
      throw new WalletNotInstalledError('Arconnect is not installed.');
    /**
     * This is here because occasionally arconnect injects but does not initialize internally properly,
     * allowing the api to be called but then hanging.
     * This is a workaround to check that and emit appropriate errors,
     * and to trigger the workaround workflow of reloading the page and re-initializing arconnect.
     */
    const res = await executeWithTimeout(() => fn(), 3000);

    if (res === 'timeout') {
      throw new Error(ARCONNECT_UNRESPONSIVE_ERROR);
    }
    return res as T;
  }

  async connect(): Promise<string> {
    // confirm they have the extension installed
    localStorage.setItem('walletType', WALLET_TYPES.OTHENT);

    await this._wallet.connect().catch((err) => {
      localStorage.removeItem('walletType');
      console.error(err);
      throw new OthentError('User cancelled authentication.');
    });
    return this.getWalletAddress();
  }

  async disconnect(): Promise<void> {
    localStorage.removeItem('walletType');
    this._wallet.disconnect();
  }

  async getWalletAddress(): Promise<string> {
    return this.safeArconnectApiExecutor(() =>
      this._wallet?.getActiveAddress(),
    );
  }

  async getGatewayConfig(): Promise<ApiConfig> {
    const config = DEFAULT_ARWEAVE.getConfig();
    return config as unknown as ApiConfig;
  }

  async updatePermissions(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
