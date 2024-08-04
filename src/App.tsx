import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { wrapCreateBrowserRouter } from '@sentry/react';
import React, { Suspense, useEffect } from 'react';
import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { useAccount } from 'wagmi';

import AppRouterLayout from './components/layout/AppRouterLayout';
import Disclaimer from './components/modals/RainbowKitDisclaimerSection';
import NotFound from './pages/NotFound';
import { errorEmitter } from './services/events';
import { useGlobalState } from './services/state/useGlobalState';
import { WagmiWalletConnector } from './services/wallets/WagmiWalletConnector';

const Home = React.lazy(() => import('./pages/Home'));

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
  welcomeSound.play();
  const { address } = useAccount();

  const setWallet = useGlobalState((s) => s.setWallet);
  const setAddress = useGlobalState((s) => s.setAddress);

  useEffect(() => {
    updateWallet(address);
  }, [address]);

  async function updateWallet(address?: string) {
    try {
      console.log('updateWallet', address);
      let ethersProvider = undefined;
      if (address) {
        ethersProvider = await WagmiWalletConnector.createConnector();
      }
      console.log('ethersProvider', ethersProvider);
      setAddress(address);
      setWallet(ethersProvider);
    } catch (error) {
      errorEmitter.emit('error', error);
      setAddress(undefined);
      setWallet(undefined);
    }
  }
  const router = sentryCreateBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppRouterLayout />} errorElement={<NotFound />}>
        <Route
          index
          element={
            <Suspense
              fallback={<div className="center flex flex-row">Loading</div>}
            >
              <Home />
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
        <RouterProvider router={router} />
      </RainbowKitProvider>
    </>
  );
}

export default App;
