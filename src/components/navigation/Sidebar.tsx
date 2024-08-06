import React from 'react';

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-fit flex-col">
      <div className="flex h-full w-full flex-col items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}

export default Sidebar;
