import { createAoSigner } from '@ar.io/sdk';
import { errorEmitter } from '@src/services/events';
import { useGlobalState } from '@src/services/state/useGlobalState';
import { ArConnectWalletConnector } from '@src/services/wallets/ArconnectWalletConnector';
import { ArweaveAppWalletConnector } from '@src/services/wallets/ArweaveAppWalletConnector';
import { OthentWalletConnector } from '@src/services/wallets/OthentWalletConnector';
import { WalletConnector } from '@src/services/wallets/arweave';
import { update } from 'lodash';
import { TbBrandGoogle } from 'react-icons/tb';

import Button from '../buttons/Button';

function Disclaimer() {
  const updateProfiles = useGlobalState((s) => s.updateProfiles);
  const setWallet = useGlobalState((s) => s.setWallet);
  const setAddress = useGlobalState((s) => s.setAddress);
  const buttonClasses =
    'flex bg-primaryThin p-2 pl-[45px] relative rounded-md border-2 border-primary hover:bg-foregroundThin hover:border-foreground hover:shadow-foregroundThin transition-all items-center gap-4 h-[40px]';

  async function handleConnect(provider: WalletConnector) {
    try {
      // updates address and aoSigner in global state hook
      const maybeAddress = await provider.getWalletAddress().catch(() => null);
      !maybeAddress && (await provider.connect());
      setWallet(provider);
      const address = await provider.getWalletAddress();
      setAddress(address);
      const signer = await createAoSigner(provider.arconnectSigner!);
      await updateProfiles(address, signer);
    } catch (error) {
      errorEmitter.emit('error', error);
    }
  }

  return (
    <div className="absolute right-0 top-0 flex h-full w-[60%] items-center justify-end">
      <div className="flex h-full w-full bg-cyber-garden">
        <div className="flex h-full w-full flex-col gap-6 bg-[rgb(0,0,0,0.9)] p-6 text-secondary">
          <h1 className="text-bold">
            You may connect with an Arweave provider below, or an EVM provider
            on the left.
          </h1>
          <Button
            classes={buttonClasses}
            onClick={() => handleConnect(new ArConnectWalletConnector())}
          >
            <img
              src="/images/wallet-icons/ArConnectIcon.svg"
              width={'45px'}
              height={'45px'}
              className="absolute left-0"
            />
            ArConnect
          </Button>
          <Button
            classes={buttonClasses}
            onClick={() => handleConnect(new ArweaveAppWalletConnector())}
          >
            <img
              src="/images/wallet-icons/ArweaveAppIcon.png"
              width={'22px'}
              height={'22px'}
              className="absolute left-3"
            />
            Arweave.app
          </Button>
          <Button
            classes={buttonClasses}
            onClick={() => handleConnect(new OthentWalletConnector())}
          >
            <TbBrandGoogle className="absolute left-3 text-xl" />
            Othent
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Disclaimer;
