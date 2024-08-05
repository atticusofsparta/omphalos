import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useGlobalState } from '@src/services/state/useGlobalState';
import { formatArweaveAddress } from '@src/utils';
import { motion } from 'framer-motion';

import { menuSound } from '../navigation/ProfileMenu';
import Button from './Button';

function ProfileButton() {
  const address = useGlobalState((state) => state.address);
  const showProfileMenu = useGlobalState((state) => state.showProfileMenu);
  const setShowProfileMenu = useGlobalState(
    (state) => state.setShowProfileMenu,
  );
  const profile = useGlobalState((state) => state.profile);

  if (!address) {
    return <ConnectButton />;
  }

  return (
    <motion.div
      className="flex flex-row gap-5"
      animate={{
        opacity: showProfileMenu ? 0 : 1,
        transition: { duration: 0.25 },
      }}
    >
      <div className="flex flex-col gap-2 p-1 text-secondary">
        <span>
          {profile?.Profile?.DisplayName
            ? profile.Profile.DisplayName.length > 13
              ? formatArweaveAddress(profile.Profile.DisplayName)
              : profile.Profile.DisplayName
            : formatArweaveAddress(address)}
        </span>
      </div>
      <Button
        classes="bg-primary rounded-full relative shadow-primaryThin hover:shadow-primary hover:ring-1 ring-foreground transition-all duration-300"
        onClick={() => {
          menuSound.play();
          setShowProfileMenu(!showProfileMenu);
        }}
        disabled={showProfileMenu}
      >
        <img
          src={
            profile?.Profile?.ProfileImage
              ? `http://arweave.net/${profile.Profile?.ProfileImage}`
              : '/images/pfps/naturalist-human/4.webp'
          }
          width={'60px'}
          height={'60px'}
          alt="profile"
          className="rounded-full"
        />
      </Button>
    </motion.div>
  );
}

export default ProfileButton;
