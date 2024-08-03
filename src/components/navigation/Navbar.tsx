import '@rainbow-me/rainbowkit/styles.css';
import { useGlobalState } from '@src/services/state/useGlobalState';

import ProfileButton from '../buttons/ProfileButton';

function Navbar() {
  const connecting = useGlobalState((state) => state.connecting);
  const signing = useGlobalState((state) => state.signing);
  return (
    <div className="flex w-screen flex-row flex-row justify-between p-3">
      <div>
        <h1
          className={`${connecting || signing ? 'text-glitch text-glitch-duration-slow' : ''} text-6xl tracking-widest text-foreground drop-shadow-md`}
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
  );
}

export default Navbar;
