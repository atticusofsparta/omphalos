import { ArweaveWalletKit } from 'arweave-wallet-kit';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './index.css';
import './index.css';
// setup sentry
import './services/sentry.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ArweaveWalletKit
      config={{
        permissions: [
          'ACCESS_ADDRESS',
          'ACCESS_ALL_ADDRESSES',
          'ACCESS_PUBLIC_KEY',
        ],
        appInfo: {
          name: 'Omphalos',
        },
      }}
      theme={{
        accent: { r: 255, g: 42, b: 109 },
        displayTheme: 'dark',
      }}
    >
      <App />
    </ArweaveWalletKit>
  </React.StrictMode>,
);
