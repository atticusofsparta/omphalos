import { APP_PERMISSIONS } from '@src/constants';
import { ApiConfig } from 'arweave/node/lib/api';

import { ArconnectError, WalletNotInstalledError } from '../../../types/error';
import { executeWithTimeout } from '../../utils';
import { errorEmitter } from '../events';
import {
  ARCONNECT_UNRESPONSIVE_ERROR,
  WALLET_TYPES,
  WalletConnector,
} from './arweave';

export class ArConnectWalletConnector implements WalletConnector {
  private _wallet: Window['arweaveWallet'];
  arconnectSigner: Window['arweaveWallet'];
  constructor() {
    this._wallet = window?.arweaveWallet;
    this.arconnectSigner = window?.arweaveWallet;
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
    if (!window.arweaveWallet) {
      window.open('https://arconnect.io');

      return this.getWalletAddress();
    }
    // confirm they have the extension installed
    localStorage.setItem('walletType', WALLET_TYPES.ARCONNECT);
    const permissions = await this.safeArconnectApiExecutor(
      this._wallet?.getPermissions,
    );
    if (
      permissions &&
      !APP_PERMISSIONS.every((permission) => permissions.includes(permission))
    ) {
      // disconnect due to missing permissions, then re-connect
      await this.safeArconnectApiExecutor(this._wallet?.disconnect);
    } else if (permissions) {
      return this.getWalletAddress();
    }

    await this._wallet
      .connect(
        APP_PERMISSIONS,
        {
          name: 'ARNS - ar.io',
        },
        // TODO: add arweave configs here
      )
      .catch((err) => {
        localStorage.removeItem('walletType');
        console.error(err);
        throw new ArconnectError('User cancelled authentication.');
      });
    return this.getWalletAddress();
  }

  async disconnect(): Promise<void> {
    localStorage.removeItem('walletType');
    return this.safeArconnectApiExecutor(this._wallet?.disconnect);
  }

  async getWalletAddress(): Promise<string> {
    return this.safeArconnectApiExecutor(() =>
      this._wallet?.getActiveAddress(),
    );
  }

  async getGatewayConfig(): Promise<ApiConfig> {
    const config = await this.safeArconnectApiExecutor(
      this._wallet?.getArweaveConfig,
    );
    return config as unknown as ApiConfig;
  }

  async updatePermissions(): Promise<void> {
    // check we have the necessary permissions
    const permissions = await this._wallet.getPermissions();
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
