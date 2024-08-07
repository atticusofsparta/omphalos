import { DataItem } from 'arbundles';
import { ApiConfig } from 'arweave/node/lib/api';

export interface WalletConnector {
  connect(): Promise<string>;
  disconnect(): Promise<void>;
  getWalletAddress(): Promise<string>;
  signDataItem(data: DataItem): Promise<ArrayBufferLike>;
  getActivePublicKey(): Promise<string>;
  getGatewayConfig(): Promise<ApiConfig>;
  arconnectSigner?: Window['arweaveWallet'];
}

export enum WALLET_TYPES {
  ARCONNECT = 'ArConnect',
  ARWEAVE_APP = 'ArweaveApp',
  OTHENT = 'Othent',
  EVM = 'EVM',
}

export const ARCONNECT_UNRESPONSIVE_ERROR =
  'There was an issue initializing ArConnect. Please reload the page to initialize.';
