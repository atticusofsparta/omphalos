import { Outlet } from 'react-router-dom';

import Navbar from '../navigation/Navbar';
import ProfileMenu from '../navigation/ProfileMenu';
import Notifications from './Notifications';

function AppRouterLayout() {
  return (
    <div className="scrollbar h-screen w-screen overflow-x-auto overflow-y-hidden bg-cyber-garden bg-cover bg-no-repeat dark:bg-background dark:text-foregroundSubtle">
      <div className="h-full bg-[rgb(0,0,0,0.9)]">
        <Navbar />

        <div className="relative flex h-full flex-row">
          <Outlet />
        </div>
        <Notifications />
      </div>
      <ProfileMenu />
    </div>
  );
}

export default AppRouterLayout;
