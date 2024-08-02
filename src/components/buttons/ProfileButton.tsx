import { useGlobalState } from '@src/services/state/useGlobalState';
import { formatArweaveAddress } from '@src/utils';
import { useActiveAddress } from 'arweave-wallet-kit';
import { motion } from 'framer-motion';
import { TbPencil } from 'react-icons/tb';

import { menuSound } from '../navigation/ProfileMenu';
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
    <motion.div
      className="flex flex-row gap-5"
      animate={{
        opacity: showProfileMenu ? 0 : 1,
        transition: { duration: 0.25 },
      }}
    >
      <div className="flex flex-col gap-2 p-1 text-secondary">
        <span>
          {profile?.DisplayName
            ? profile.DisplayName.length > 13
              ? formatArweaveAddress(profile.DisplayName)
              : profile.DisplayName
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
            profile?.ProfileImage
              ? `http://arweave.net/${profile?.ProfileImage}`
              : '/images/pfps/naturalist-human/4.webp'
          }
          width={'75px'}
          height={'75px'}
          alt="profile"
          className="rounded-full"
        />
      </Button>
    </motion.div>
  );
}

export default ProfileButton;
