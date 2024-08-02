import { wrapCreateBrowserRouter } from '@sentry/react';
import React, { Suspense } from 'react';
import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import AppRouterLayout from './components/layout/AppRouterLayout';
import NotFound from './pages/NotFound';

const Home = React.lazy(() => import('./pages/Home'));

const sentryCreateBrowserRouter = wrapCreateBrowserRouter(createHashRouter);
export const welcomeSound = new Howl({
  src: ['/public/sounds/welcome-to-omphalos.wav'],
  volume: 0.5,
  loop: false,
});

function App() {
  welcomeSound.play();
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
      <RouterProvider router={router} />
    </>
  );
}

export default App;
