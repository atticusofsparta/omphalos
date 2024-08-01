import { useGlobalState } from '@src/services/state/useGlobalState';
import { formatArweaveAddress } from '@src/utils';
import { useActiveAddress } from 'arweave-wallet-kit';

import Button from './Button';
import ConnectButton from './ConnectButton';

function ProfileButton() {
  const address = useActiveAddress();
  const showProfileMenu = useGlobalState((state) => state.showProfileMenu);
  const setShowProfileMenu = useGlobalState(
    (state) => state.setShowProfileMenu,
  );
  const profile = useGlobalState((state) => state.profile);

  if (!address) {
    return <ConnectButton />;
  }

  return (
    <div className="flex flex-row gap-4">
      <div className="flex-column flex gap-5 p-1 text-secondary">
        <span>{profile?.DisplayName ?? formatArweaveAddress(address)}</span>
        <span></span>
      </div>
      <Button
        classes="bg-primary rounded-full shadow-primaryThin hover:shadow-primary hover:ring-1 ring-foreground transition-all duration-300"
        onClick={() => setShowProfileMenu(!showProfileMenu)}
      >
        <img
          className="rounded-full"
          src="/images/pfps/naturalist-human/4.webp"
          width="75px"
          height="75px"
          alt="profile"
        />
      </Button>
    </div>
  );
}

export default ProfileButton;
