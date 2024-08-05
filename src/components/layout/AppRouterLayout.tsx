import { Outlet } from 'react-router-dom';

import Navbar from '../navigation/Navbar';
import ProfileMenu from '../navigation/ProfileMenu';
import Notifications from './Notifications';

function AppRouterLayout() {
  return (
    <div className="flex h-screen w-screen flex-col bg-cyber-garden bg-cover bg-no-repeat dark:bg-background dark:text-foregroundSubtle">
      <div className="box-border flex h-full w-full flex-col bg-[rgb(0,0,0,0.9)]">
        <Navbar />

        <div className="flex flex-col scrollbar">
          <Outlet />
        </div>
        <Notifications />
      </div>
      <ProfileMenu />
      {/* audio and notification visualizer - cortana-esque? */}
      {/* https://codepen.io/Goliver/pen/povVOKd TODO: crystal ball look */}
      {/* <div className="shadow-foregroundThin absolute bottom-[120px] right-4 h-[150px] w-[150px] rounded-full border-2 border-foreground">
        <WasmMemoryVisualizer />
      </div> */}
    </div>
  );
}

export default AppRouterLayout;
