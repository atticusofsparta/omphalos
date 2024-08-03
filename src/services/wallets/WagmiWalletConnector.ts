import { APP_PERMISSIONS } from '@src/constants';
import { PermissionType } from 'arconnect';
import { ApiConfig } from 'arweave/node/lib/api';
import { JsonRpcSigner } from 'ethers';

import { WagmiError, WalletNotInstalledError } from '../../../types/error';
import { executeWithTimeout } from '../../utils';
import { errorEmitter } from '../events';
import {
  ARCONNECT_UNRESPONSIVE_ERROR,
  WALLET_TYPES,
  WalletConnector,
} from './arweave';
import { createArconnectLikeEvmInterface, getEthersSigner } from './evmWallets';

export class WagmiWalletConnector implements WalletConnector {
  private _wallet: JsonRpcSigner;
  arconnectSigner: Window['arweaveWallet'];
  constructor(signer: JsonRpcSigner) {
    this._wallet = signer;
    this.arconnectSigner = createArconnectLikeEvmInterface(signer);
  }

  static async createConnector() {
    const signer = await getEthersSigner();
    return new WagmiWalletConnector(signer);
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

  async connect(): Promise<void> {
    if (!window.arweaveWallet) {
      window.open('https://arconnect.io');

      return;
    }
    // confirm they have the extension installed
    localStorage.setItem('walletType', WALLET_TYPES.ARCONNECT);
    const permissions = await this.safeArconnectApiExecutor(
      this.arconnectSigner?.getPermissions,
    );
    if (
      permissions &&
      !APP_PERMISSIONS.every((permission) => permissions.includes(permission))
    ) {
      // disconnect due to missing permissions, then re-connect
      await this.safeArconnectApiExecutor(this.arconnectSigner?.disconnect);
    } else if (permissions) {
      return;
    }

    await this.arconnectSigner.connect(APP_PERMISSIONS).catch((err) => {
      localStorage.removeItem('walletType');
      console.error(err);
      throw new WagmiError('User cancelled authentication.');
    });
  }

  async disconnect(): Promise<void> {
    localStorage.removeItem('walletType');
    return this.safeArconnectApiExecutor(this.arconnectSigner?.disconnect);
  }

  async getWalletAddress(): Promise<string> {
    return this.safeArconnectApiExecutor(() =>
      this.arconnectSigner?.getActiveAddress(),
    );
  }

  async getGatewayConfig(): Promise<ApiConfig> {
    const config = await this.safeArconnectApiExecutor(
      this.arconnectSigner?.getArweaveConfig,
    );
    return config as unknown as ApiConfig;
  }

  async updatePermissions(): Promise<void> {
    // check we have the necessary permissions
    const permissions = await this.arconnectSigner.getPermissions();
    if (
      permissions &&
      !APP_PERMISSIONS.every((permission) => permissions.includes(permission))
    ) {
      const missingPermissions = APP_PERMISSIONS.filter(
        (permission) => !permissions.includes(permission),
      );
      errorEmitter.emit(
        'error',
        new Error(
          `Missing permissions (${missingPermissions.join(
            ', ',
          )}), please re-authorize permissions.`,
        ),
      );
      await this.disconnect();
      await this.connect();
    }
  }
}
