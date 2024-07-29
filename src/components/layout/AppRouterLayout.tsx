import { Outlet } from 'react-router-dom';

import Navbar from '../navigation/Navbar';
import ProfileMenu from '../navigation/ProfileMenu';
import Notifications from './Notifications';

function AppRouterLayout() {
  return (
    <div className="scrollbar bg-cyber-garden h-screen w-screen overflow-x-auto overflow-y-hidden bg-cover bg-no-repeat dark:bg-background dark:text-foregroundSubtle">
      <Navbar />
      <div className="relative flex h-full flex-row">
        <Outlet />
        <div className="flex h-full">
          <ProfileMenu />
        </div>
      </div>
      <Notifications />
    </div>
  );
}

export default AppRouterLayout;
