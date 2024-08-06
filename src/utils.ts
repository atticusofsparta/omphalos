import { DEFAULT_ARWEAVE, THEME_TYPES } from './constants';

// for tailwind css, need the change the root
export const applyThemePreference = (theme: string) => {
  const { DARK, LIGHT } = THEME_TYPES;
  const root = window.document.documentElement;
  const isDark = theme === DARK;
  root.classList.remove(isDark ? LIGHT : DARK);
  root.classList.add(theme);
};

export function formatArweaveAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function copyToClipboard(text: string) {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

export function safeDecode(json: string) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
}

export const executeWithTimeout = async (fn: () => any, ms: number) => {
  return await Promise.race([
    fn(),
    new Promise((resolve) => setTimeout(() => resolve('timeout'), ms)),
  ]);
};

export function camelToReadable(camel: string) {
  const words = camel.replace(/([A-Z])/g, ' $1').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export async function uploadImage(
  img: string,
  signer: Window['arweaveWallet'],
) {
  const bloob = await fetch(img).then((r) => r.blob());
  const transaction = await DEFAULT_ARWEAVE.createTransaction({
    data: await bloob.arrayBuffer(),
  });

  transaction.addTag('Content-Type', bloob.type);
  await signer.sign(transaction);
  await DEFAULT_ARWEAVE.transactions.post(transaction);
  return transaction.id;
}
