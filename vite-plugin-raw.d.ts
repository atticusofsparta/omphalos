declare module 'vite-plugin-raw' {
  import { Plugin } from 'vite';

  interface RawPluginOptions {
    match: RegExp;
  }

  export function rawPlugin(options: RawPluginOptions): Plugin;
}
