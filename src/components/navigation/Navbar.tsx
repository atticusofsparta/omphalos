import { useGlobalState } from '@src/services/state/useGlobalState';

import ProfileButton from '../buttons/ProfileButton';

function Navbar() {
  const connecting = useGlobalState((state) => state.connecting);
  const signing = useGlobalState((state) => state.signing);
  return (
    <div className="flex w-screen flex-row flex-row justify-between  bg-[rgb(0,0,0,0.7)] p-3 backdrop-blur-sm">
      <div>
        <h1
          className={`${connecting || signing ? 'text-glitch text-glitch-duration-slow' : ''} text-4xl tracking-widest text-foreground drop-shadow-md`}
        >
          Ωmphalos
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
