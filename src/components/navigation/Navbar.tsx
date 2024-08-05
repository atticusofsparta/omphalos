import '@rainbow-me/rainbowkit/styles.css';
import { ROUTES } from '@src/App';
import { useGlobalState } from '@src/services/state/useGlobalState';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

import ProfileButton from '../buttons/ProfileButton';

export const bloopSound = new Howl({
  src: ['/public/sounds/bloop.wav'],
  volume: 0.01,
});

export const navLinkEnabledHoverSound = new Howl({
  src: ['/public/sounds/disabled.wav'],
  volume: 0.2,
});

export const navPageChangeSound = new Howl({
  src: ['/public/sounds/woosh.mp3'],
  volume: 0.2,
  rate: 2,
});
function NavLink({
  to,
  name,
  disabled,
}: {
  to: string;
  name: string;
  disabled?: boolean;
}) {
  const location = useLocation();
  const pageName = location.pathname.split('/')[1];

  const isSamePage = pageName.toLowerCase() === name.toLowerCase();
  return (
    <motion.div
      onMouseEnter={() => {
        if (!disabled && !isSamePage) {
          isSamePage ? navLinkEnabledHoverSound.play() : bloopSound.play();
        }
      }}
      onClick={() => {
        if (isSamePage) {
          navLinkEnabledHoverSound.play();
        } else {
          navPageChangeSound.play();
        }
      }}
      className={
        'flex items-center justify-center rounded-t-md px-4 text-lg transition-all hover:text-foreground ' +
        (disabled
          ? 'text-disabled'
          : isSamePage
            ? 'text-primary'
            : 'text-secondary')
      }
    >
      {disabled ? (
        <span className="text-disabled cursor-pointer text-xs">{name}</span>
      ) : (
        <Link
          aria-disabled={disabled}
          to={to}
          className="flex items-center justify-center text-sm"
        >
          {name}
        </Link>
      )}
    </motion.div>
  );
}

function Navbar() {
  const connecting = useGlobalState((state) => state.connecting);
  const signing = useGlobalState((state) => state.signing);
  return (
    <div className="flex w-screen flex-col">
      <div className="flex w-screen flex-row justify-between p-3 px-10">
        <div>
          <h1
            className={`${connecting || signing ? 'text-glitch text-glitch-duration-slow' : ''} text-5xl tracking-widest text-foreground drop-shadow-md`}
          >
            <span className="text-primary text-glitch text-glitch-duration-slow">
              Ω
            </span>
            mphalos
          </h1>
        </div>
        {/* right group */}
        <div>
          <ProfileButton />
        </div>
      </div>

      <div className="flex h-[40px] flex-row pl-5 shadow-primaryThinBottom">
        {/* tab group */}
        {ROUTES.map((route) => (
          <NavLink
            key={route.name}
            to={route.to}
            name={route.name}
            disabled={!route.enabled}
          />
        ))}
      </div>
    </div>
  );
}

export default Navbar;
