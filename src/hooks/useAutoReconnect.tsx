import { createAoSigner } from '@ar.io/sdk';
import { errorEmitter } from '@src/services/events';
import { useGlobalState } from '@src/services/state/useGlobalState';
import {
  ArConnectWalletConnector,
  ArweaveAppWalletConnector,
  OthentWalletConnector,
  WagmiWalletConnector,
} from '@src/services/wallets';
import { WALLET_TYPES, WalletConnector } from '@src/services/wallets/arweave';
import { JsonRpcSigner } from 'ethers';
import { useEffect, useState } from 'react';
import { Connector, useAccount } from 'wagmi';

import { useEthersProvider } from './useEthersProvider';

function useAutoReconnect() {
  const { address: ethAddress, connector: ethConnector } = useAccount();
  const ethersProvider = useEthersProvider();
  const address = useGlobalState((s) => s.address);
  const setAddress = useGlobalState((s) => s.setAddress);
  const wallet = useGlobalState((s) => s.wallet);
  const setWallet = useGlobalState((s) => s.setWallet);
  const updateProfiles = useGlobalState((s) => s.updateProfiles);
  const setShowProfileMenu = useGlobalState((s) => s.setShowProfileMenu);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (updating) return;
    let walletType: WALLET_TYPES = localStorage.getItem(
      'walletType',
    ) as WALLET_TYPES;

    if (!walletType && ethAddress !== undefined) {
      walletType = WALLET_TYPES.EVM;
    }
    reconnect(walletType);
  }, [ethConnector]);

  async function reconnect(walletType: WALLET_TYPES) {
    try {
      setUpdating(true);
      let connector: WalletConnector | undefined = undefined;
      if (
        (walletType && !address) ||
        (walletType === WALLET_TYPES.EVM && ethConnector)
      ) {
        switch (walletType) {
          case WALLET_TYPES.ARCONNECT: {
            connector = new ArConnectWalletConnector();
            break;
          }
          case WALLET_TYPES.ARWEAVE_APP: {
            connector = new ArweaveAppWalletConnector();

            break;
          }
          case WALLET_TYPES.EVM: {
            connector = await WagmiWalletConnector.createConnector(
              ethersProvider as any as JsonRpcSigner,
              ethConnector as Connector,
            );
            break;
          }
          case WALLET_TYPES.OTHENT: {
            connector = new OthentWalletConnector();
            break;
          }
          default:
            break;
        }
      }
      if (connector) {
        let newAddress: string | undefined = ethAddress;
        if (walletType !== WALLET_TYPES.EVM) {
          newAddress = await connector.connect();
        }

        setAddress(newAddress);
        setWallet(connector);
        const signer = createAoSigner(connector.arconnectSigner as any);
        await updateProfiles(
          newAddress as string,
          signer,
          connector.arconnectSigner!,
        ).catch((e) => {
          setShowProfileMenu(true);
          errorEmitter.emit(
            'error',
            new Error('No profiles found, create a profile to continue'),
          );
        });
      }
    } catch (error) {
      errorEmitter.emit('error', error);
      setAddress(undefined);
      setWallet(undefined);
    } finally {
      setUpdating(false);
    }
  }
}

export default useAutoReconnect;
