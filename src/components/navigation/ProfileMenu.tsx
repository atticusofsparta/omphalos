import WasmMemoryVisualizer from '@src/components/layout/background/WasmMemoryVisualizer';
import { notificationEmitter } from '@src/services/events';
import { useGlobalState } from '@src/services/state/useGlobalState';
import { formatArweaveAddress } from '@src/utils';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import { useEffect, useRef, useState } from 'react';

import Button from '../buttons/Button';
import CopyButton from '../buttons/CopyButton';
import SpaceScene from '../layout/background/SpaceScene';
import CreateProfileModal from '../modals/CreateProfileModal';

export const menuSound = new Howl({
  src: ['/sounds/menu-sound.wav'],
  volume: 0.2,
  loop: false,
});
function ProfileMenu() {
  const resetState = useGlobalState((state) => state.reset);
  const wallet = useGlobalState((state) => state.wallet);
  const address = useGlobalState((state) => state.address);
  const setAddress = useGlobalState((state) => state.setAddress);
  const setWallet = useGlobalState((state) => state.setWallet);
  const showProfileMenu = useGlobalState((state) => state.showProfileMenu);
  const profileId = useGlobalState((state) => state.profileId);
  const p = useGlobalState((state) => state.profile);
  const profile = p?.Profile;
  const setShowProfileMenu = useGlobalState(
    (state) => state.setShowProfileMenu,
  );
  const menuRef = useRef<HTMLDivElement>();

  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);

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
        className={`absolute right-0 top-0 box-border flex h-full backdrop-blur-sm backdrop-filter`}
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

            <div className="absolute bottom-0 left-0 flex flex h-full w-full flex-row flex-col justify-between bg-[rgb(0,0,0,0.8)] p-2 text-secondary">
              <div className="flex w-full flex-row justify-between">
                <div className="flex flex-col gap-2">
                  {profileId && (
                    <span className="flex items-center justify-center gap-2">
                      Profile: {formatArweaveAddress(profileId ?? '')}{' '}
                      <CopyButton text={address ?? ''} />
                    </span>
                  )}
                  <span className="flex items-center justify-center gap-2">
                    Wallet: {formatArweaveAddress(address ?? '')}{' '}
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
                  {profile?.ProfileImage ? (
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
                  ) : (
                    <div className="bottom-[120px] right-4 h-[100px] w-[100px] rounded-full border-2 border-foreground bg-black shadow-foregroundThin">
                      <WasmMemoryVisualizer />{' '}
                    </div>
                  )}
                </Button>
              </div>

              <div className="flex w-full flex-row justify-end">
                {profile ? (
                  <Button
                    onClick={() => console.log('click')}
                    sound={
                      new Howl({
                        src: ['/sounds/bloop.wav'],
                        volume: 0.05,
                        loop: false,
                      })
                    }
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    classes="animate-bounce text-foreground border-2 border-foreground hover:bg-foreground hover:text-secondary p-2 rounded-md shadow-primaryThin bg-primaryThin"
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowCreateProfileModal(true);
                    }}
                    sound={
                      new Howl({
                        src: ['/sounds/bloop.wav'],
                        volume: 0.05,
                        loop: false,
                      })
                    }
                  >
                    Create Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="box-border flex h-[66%] w-full items-end justify-end bg-[rgb(0,0,0,0.3)] p-4">
            <Button
              classes="hover:text-primary text-secondary text-lg h-fit"
              onClick={async () => {
                await wallet?.disconnect();
                setAddress(undefined);
                setWallet(undefined);
                notificationEmitter.emit('notification', 'Disconnected');
                setShowProfileMenu(false);
                resetState();
              }}
              sound={menuSound}
            >
              Disconnect
            </Button>
          </div>
        </motion.div>

        {/* background */}
        <div className="absolute right-0 top-0 flex h-full w-full p-2">
          <SpaceScene />
        </div>
      </motion.div>
      <CreateProfileModal
        showModal={showCreateProfileModal}
        setShowModal={(b: boolean) => setShowCreateProfileModal(b)}
      />
    </>
  );
}

export default ProfileMenu;
