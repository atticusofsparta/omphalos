import { AoSigner, createAoSigner } from '@ar.io/sdk';
import { THEME_TYPES } from '@src/constants';
import { create } from 'zustand';

import { AoProfile } from '../ao/profiles/Profile';
import { WalletConnector } from '../wallets/arweave';

export type ThemeType = (typeof THEME_TYPES)[keyof typeof THEME_TYPES];

export type GlobalState = {
  connecting: boolean;
  signing: boolean;
  aoSigner?: AoSigner;
  wallet?: WalletConnector;
  address?: string;
  showProfileMenu: boolean;
  profile?: AoProfile;
};

export type GlobalStateActions = {
  setConnecting: (connecting: boolean) => void;
  setSigning: (signing: boolean) => void;
  setShowProfileMenu: (showProfileMenu: boolean) => void;
  setProfile: (profile?: AoProfile) => void;
  setWallet: (wallet?: WalletConnector) => void;
  setAddress: (address?: string) => void;
  setAoSigner: (aoSigner?: AoSigner) => void;
  reset: () => void;
};

export const initialGlobalState: GlobalState = {
  connecting: false,
  signing: false,
  showProfileMenu: false,
  profile: undefined,
};

export class GlobalStateActionBase implements GlobalStateActions {
  constructor(
    private set: (props: any) => void,
    private initialGlobalState: GlobalState,
  ) {}
  setConnecting = (connecting: boolean) => {
    this.set({ connecting });
  };
  setSigning = (signing: boolean) => {
    this.set({ signing });
  };
  setShowProfileMenu = (showProfileMenu: boolean) => {
    this.set({ showProfileMenu });
  };
  setProfile = (profile: AoProfile | undefined) => {
    this.set({ profile });
  };
  setWallet = (wallet: WalletConnector | undefined) => {
    if (wallet !== undefined) {
      const aoSigner = createAoSigner(
        'arconnectSigner' in wallet ? wallet.arconnectSigner : (wallet as any),
      );
      this.setAoSigner(aoSigner);
    }

    this.set({ wallet });
  };
  setAddress = (address: string | undefined) => {
    this.set({ address });
  };
  setAoSigner = (aoSigner: AoSigner | undefined) => {
    this.set({ aoSigner });
  };
  reset = () => {
    this.set({ ...this.initialGlobalState });
  };
}

export interface GlobalStateInterface extends GlobalState, GlobalStateActions {}
export const useGlobalState = create<GlobalStateInterface>()((set: any) => ({
  ...initialGlobalState,
  ...new GlobalStateActionBase(set, initialGlobalState),
}));
