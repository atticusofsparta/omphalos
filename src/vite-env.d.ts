// custom.d.ts
import 'react';

/// <reference types="vite/client" />

// useful for intellisense to auto detect available env vars
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_SENTRY_DSN_PUBLIC_KEY: string;
  readonly VITE_SENTRY_DSN_PROJECT_URI: string;
  readonly VITE_SENTRY_DSN_PROJECT_ID: string;
  readonly VITE_NODE_ENV: string;
  readonly VITE_GITHUB_HASH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'react' {
  interface InputHTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    directory?: boolean | string;
    webkitdirectory?: boolean | string;
    mozdirectory?: boolean | string;
  }
}
