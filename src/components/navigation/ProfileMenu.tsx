import { useGlobalState } from '@src/services/state/useGlobalState';
import { formatArweaveAddress } from '@src/utils';
import { useActiveAddress } from 'arweave-wallet-kit';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import CopyButton from '../buttons/CopyButton';

function ProfileMenu() {
  const showProfileMenu = useGlobalState((state) => state.showProfileMenu);
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
        setShowProfileMenu(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  return (
    <>
      <motion.div
        animate={{
          opacity: showProfileMenu ? 1 : 0,
          width: showProfileMenu ? 'fit-content' : '0%',
          transition: { duration: 0.25 },
        }}
        className={`absolute right-0 top-0 box-border flex h-full p-2`}
        ref={menuRef as any}
      >
        <motion.div
          animate={{
            padding: showProfileMenu ? '6px' : '0',
            border: showProfileMenu ? '2px' : '0',
            boxShadow: showProfileMenu ? undefined : '0 0 0 0',
            opacity: showProfileMenu ? 1 : 0,
            width: showProfileMenu ? 'fit-content' : '0%',
            transition: { duration: 0.25 },
          }}
          className={`box-border flex-row justify-between overflow-hidden rounded-xl border-2 border-primary bg-foregroundThin shadow-primaryThin backdrop-blur-sm`}
        >
          <div>
            <h1 className="justify-items-center text-lg tracking-widest text-foreground text-glitch">
              {formatArweaveAddress(address ?? '')}{' '}
              <CopyButton text={address ?? ''} />
            </h1>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default ProfileMenu;
