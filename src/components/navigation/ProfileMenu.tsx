import { useGlobalState } from '@src/services/state/useGlobalState';
import { formatArweaveAddress } from '@src/utils';
import { useActiveAddress } from 'arweave-wallet-kit';
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
      {showProfileMenu ? (
        <div className={`absolute right-0 top-0 p-2`} ref={menuRef as any}>
          <div className="bg-primaryThin shadow-primaryThin flex-row justify-between overflow-hidden rounded-xl border-2 border-primary p-3 backdrop-blur-sm">
            <div>
              <h1 className="text-glitch justify-items-center text-lg tracking-widest text-foreground">
                {formatArweaveAddress(address ?? '')}{' '}
                <CopyButton text={address ?? ''} />
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <> </>
      )}
    </>
  );
}

export default ProfileMenu;
