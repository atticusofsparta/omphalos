import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { wrapCreateBrowserRouter } from '@sentry/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { Suspense } from 'react';
import {
  Navigate,
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { mountStoreDevtool } from 'simple-zustand-devtools';

import AppRouterLayout from './components/layout/AppRouterLayout';
import Disclaimer from './components/modals/RainbowKitDisclaimerSection';
import useAutoReconnect from './hooks/useAutoReconnect';
import { useGlobalState } from './services/state/useGlobalState';

const Overview = React.lazy(() => import('./pages/Overview'));
const Integrations = React.lazy(() => import('./pages/Integrations'));
const Activity = React.lazy(() => import('./pages/Activity'));
const Domains = React.lazy(() => import('./pages/Domains'));
const Settings = React.lazy(() => import('./pages/Settings'));

export const ROUTES = [
  { to: '/overview', name: 'Overview', enabled: true, component: Overview },
  {
    to: '/integrations',
    name: 'Integrations',
    enabled: true,
    component: Integrations,
  },
  { to: '/activity', name: 'Activity', enabled: true, component: Activity },
  { to: '/domains', name: 'Domains', enabled: true, component: Domains },
  { to: '/usage', name: 'Usage', enabled: false },
  { to: '/monitoring', name: 'Monitoring', enabled: false },
  { to: '/storage', name: 'Storage (arfs)', enabled: false },
  { to: '/ai', name: 'AI', enabled: false },
  { to: '/settings', name: 'Settings', enabled: true, component: Settings },
];

const sentryCreateBrowserRouter = wrapCreateBrowserRouter(createHashRouter);
export const welcomeSound = new Howl({
  src: ['/public/sounds/welcome-to-omphalos.wav'],
  volume: 0.5,
  loop: false,
});

const rainbowKitTheme = darkTheme({});
rainbowKitTheme.colors.modalBackground = 'rgba(3, 160, 98, 0.40)';
rainbowKitTheme.colors.modalBorder = 'rgb(3, 160, 98)';
rainbowKitTheme.colors.accentColor = '#d1f7ff';
rainbowKitTheme.colors.accentColorForeground = '#000000';
rainbowKitTheme.fonts.body = 'Kode Mono Variable, monospace';
rainbowKitTheme.shadows.dialog = '0px 0px 15px 5px rgba(3, 160, 98, 0.40)';

function App() {
  mountStoreDevtool('Global State', useGlobalState);

  // welcomeSound.play();
  useAutoReconnect();

  const router = sentryCreateBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppRouterLayout />} errorElement={<Navigate to={'/'} />}>
        <Route
          index
          path={'/'}
          element={
            <Suspense
              fallback={
                <div className="flex h-full w-full flex-row bg-[rgb(0,0,0,0.5)]">
                  Loading
                </div>
              }
            >
              <Overview />
            </Suspense>
          }
        />
        <Route
          index
          path={'/overview'}
          element={
            <Suspense
              fallback={
                <div className="flex h-full w-full flex-row bg-[rgb(0,0,0,0.5)]">
                  Loading
                </div>
              }
            >
              <Overview />
            </Suspense>
          }
        />
        ,
        <Route
          index
          path={'/integrations'}
          element={
            <Suspense
              fallback={
                <div className="flex h-full w-full flex-row bg-[rgb(0,0,0,0.5)]">
                  Loading
                </div>
              }
            >
              <Integrations />
            </Suspense>
          }
        />
        ,
        <Route
          index
          path={'/domains'}
          element={
            <Suspense
              fallback={
                <div className="flex h-full w-full flex-row bg-[rgb(0,0,0,0.5)]">
                  Loading
                </div>
              }
            >
              <Domains />
            </Suspense>
          }
        />
      </Route>,
    ),
  );

  return (
    <>
      <RainbowKitProvider
        modalSize="wide"
        theme={rainbowKitTheme}
        appInfo={{
          appName: 'Omphalos',
          learnMoreUrl: 'https://ao.arweave.dev',
          disclaimer: Disclaimer,
        }}
      >
        <AnimatePresence onExitComplete={() => null}>
          <RouterProvider router={router} />
        </AnimatePresence>
      </RainbowKitProvider>
    </>
  );
}

export default App;
