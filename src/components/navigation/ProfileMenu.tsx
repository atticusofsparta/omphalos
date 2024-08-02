import { SpotLight } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useGlobalState } from '@src/services/state/useGlobalState';
import { formatArweaveAddress } from '@src/utils';
import { useActiveAddress } from 'arweave-wallet-kit';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import { useEffect, useRef } from 'react';
import { AmbientLight, DepthTexture } from 'three';

import Button from '../buttons/Button';
import CopyButton from '../buttons/CopyButton';
import Planet from '../layout/background/Planet';
import SpaceScene from '../layout/background/SpaceScene';

export const menuSound = new Howl({
  src: ['/sounds/menu-sound.wav'],
  volume: 0.2,
  loop: false,
});
function ProfileMenu() {
  const showProfileMenu = useGlobalState((state) => state.showProfileMenu);
  const profile = useGlobalState((state) => state.profile);
  const setShowProfileMenu = useGlobalState(
    (state) => state.setShowProfileMenu,
  );
  const menuRef = useRef<HTMLDivElement>();

  const address = useActiveAddress();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        event.target &&
        menuRef.current &&
        !menuRef.current.contains(event.target as any)
      ) {
        if (showProfileMenu == true) menuSound.play();
        setShowProfileMenu(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef, showProfileMenu]);

  return (
    <>
      <motion.div
        animate={{
          opacity: showProfileMenu ? 1 : 0,
          width: showProfileMenu ? '33%' : '0%',
          transition: { duration: 0.25 },
        }}
        className={`absolute right-0 top-0 box-border flex h-full p-2 backdrop-blur-sm backdrop-filter`}
        ref={menuRef as any}
      >
        <motion.div
          animate={{
            padding: showProfileMenu ? '6px' : '0',
            borderWidth: showProfileMenu ? '2px' : '0',
            opacity: showProfileMenu ? 1 : 0,
            width: showProfileMenu ? '100%' : '0%',
            transition: { duration: 0.25 },
          }}
          className={`bg-rgb(0,0,0,0.2) z-10 flex-row justify-between overflow-hidden rounded-2xl border-primary shadow-primaryThin`}
        >
          {/* cover image and profile info */}
          <div className="relative flex h-[33%] w-full rounded-t-2xl">
            <img
              src={
                profile?.CoverImage
                  ? `http://arweave.net/${profile?.CoverImage}`
                  : '/images/mars-texture.webp'
              }
              className="w-full rounded-t-2xl"
              height={'inherit'}
            />
            <div className="absolute bottom-0 left-0 flex h-full w-full flex-row justify-between bg-[rgb(0,0,0,0.8)] p-2 text-secondary">
              <div className="flex flex-col gap-2">
                <span className="flex items-center justify-center gap-2">
                  {formatArweaveAddress(address ?? '')}{' '}
                  <CopyButton text={address ?? ''} />
                </span>
                <span>
                  {profile?.DisplayName
                    ? profile.DisplayName.length > 13
                      ? formatArweaveAddress(profile.DisplayName)
                      : profile.DisplayName
                    : 'display name'}
                </span>
                <span>
                  {profile?.UserName
                    ? profile.UserName.length > 13
                      ? formatArweaveAddress(profile.UserName)
                      : profile.UserName
                    : 'username'}
                </span>
              </div>
              <Button
                classes="h-fit rounded-full relative shadow-primaryThin hover:shadow-primary hover:ring-1 ring-foreground transition-all duration-300"
                onClick={() => {
                  menuSound.play();
                  setShowProfileMenu(false);
                }}
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
            </div>
          </div>
        </motion.div>

        {/* background */}
        <div className="absolute right-0 top-0 flex h-full w-full p-2">
          <SpaceScene />
        </div>
      </motion.div>
    </>
  );
}

export default ProfileMenu;
