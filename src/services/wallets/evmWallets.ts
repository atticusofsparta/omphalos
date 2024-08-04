import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { APP_PERMISSIONS, DEFAULT_ARWEAVE } from '@src/constants';
import { Config, disconnect, getConnectorClient, http } from '@wagmi/core';
import { DataItem, InjectedEthereumSigner, createData } from 'arbundles';
import Transaction from 'arweave/node/lib/transaction';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import type { Account, Chain, Client, Transport } from 'viem';
import { mainnet } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'Omphalos',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet],
  transports: {
    [mainnet.id]: http('https://cloudflare-eth.com'),
  },
});

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner(
  config: Config = { ...wagmiConfig },
  { chainId }: { chainId?: number } = {},
) {
  const client = await getConnectorClient(config, { chainId });
  return clientToSigner(client);
}

export async function getArbundlesEthSigner() {
  const ethersSigner = await getEthersSigner();
  const provider = {
    getSigner: () => ({
      signMessage: (message: any) => ethersSigner.signMessage(message),
    }),
  };
  return new InjectedEthereumSigner(provider as any);
}

export function createArconnectLikeEvmInterface(
  signer: JsonRpcSigner,
): Window['arweaveWallet'] {
  const provider = {
    getSigner: () => ({
      signMessage: (message: any) => signer.signMessage(message),
    }),
  };
  const arbundlesSigner = new InjectedEthereumSigner(provider as any);
  const arconnectLikeSigner = {
    sign: async (tx: Transaction) => {
      throw new Error('Can only sign data items as an EVM signer');
    },
    getActiveAddress: async () => {
      return signer.address;
    },
    signDataItem: async (data: DataItem) => {
      const dataItem = createData(data.data, arbundlesSigner, {
        tags: data.tags,
        target: data.target,
        anchor: data.anchor,
      });
      const res = await dataItem.sign(arbundlesSigner);

      return new DataItem(res);
    },
    getArweaveConfig: async () => {
      return DEFAULT_ARWEAVE.getConfig().api as any;
    },
    getAllAddresses: async () => {
      const accounts = await signer.provider.listAccounts();
      return accounts.map((account) => account.address);
    },
    getActivePublicKey: async () => {
      await arbundlesSigner.setPublicKey();
      //convert buffer to string
      const str = arbundlesSigner.publicKey.toString('hex');
      return str;
    },
    connect: async () => {
      await signer.connect(signer.provider);
      return;
    },
    disconnect: async () => {
      await disconnect(wagmiConfig);
    },
    getPermissions: async () => {
      return APP_PERMISSIONS;
    },
  };

  return arconnectLikeSigner as any as Window['arweaveWallet'];
}
