import { useGlobalState } from '@src/services/state/useGlobalState';
import { useConnection } from 'arweave-wallet-kit';

import Button from './Button';

function ConnectButton() {
  const { connect: walletKitConnect } = useConnection();
  const setConnecting = useGlobalState((state) => state.setConnecting);
  async function connect() {
    try {
      setConnecting(true);
      await walletKitConnect();
    } catch (error) {
      console.error(error);
    } finally {
      setConnecting(false);
    }
  }
  return (
    <Button
      onClick={connect}
      classes="bg-primary text-foregroundSubtle hover:text-foreground p-2 hover:rounded transition-all font-bold drop-shadow-md"
    >
      Connect
    </Button>
  );
}

export default ConnectButton;
