import { AoSigner, createAoSigner } from '@ar.io/sdk';
import { THEME_TYPES } from '@src/constants';
import { create } from 'zustand';

import {
  AoProfile,
  AoProfileRead,
  AoProfileWrite,
  Profile,
  ProfileInfoResponse,
} from '../ao/profiles/Profile';
import {
  AoProfileRegistryReadable,
  ProfileRegistry,
} from '../ao/profiles/ProfileRegistry';
import { WalletConnector } from '../wallets/arweave';

export type ThemeType = (typeof THEME_TYPES)[keyof typeof THEME_TYPES];

export type GlobalState = {
  connecting: boolean;
  signing: boolean;
  aoSigner?: AoSigner;
  wallet?: WalletConnector;
  address?: string;
  showProfileMenu: boolean;
  profileId?: string;
  profile?: ProfileInfoResponse;
  profiles?: Record<string, AoProfile>;
  profileProvider?: AoProfileRead | AoProfileWrite;
  profileRegistryProvider: AoProfileRegistryReadable;
};

export type GlobalStateActions = {
  setConnecting: (connecting: boolean) => void;
  setSigning: (signing: boolean) => void;
  setShowProfileMenu: (showProfileMenu: boolean) => void;
  setProfile: (profile?: AoProfile) => void;
  setWallet: (wallet?: WalletConnector) => void;
  setAddress: (address?: string) => void;
  setAoSigner: (aoSigner?: AoSigner) => void;
  updateProfiles: (address: string, signer: AoSigner) => Promise<void>;
  reset: () => void;
};

export const initialGlobalState: GlobalState = {
  connecting: false,
  signing: false,
  showProfileMenu: false,
  profile: undefined,
  profiles: {},
  profileProvider: undefined,
  profileRegistryProvider: ProfileRegistry.init(),
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
  updateProfiles = async (address: string, signer: AoSigner) => {
    const registry = this.initialGlobalState.profileRegistryProvider;
    const profileIds = await registry.getProfilesByAddress({
      address,
    });
    console.log(profileIds);
    const profiles: Record<string, Profile> = {};
    await Promise.all(
      profileIds.map(async ({ ProfileId }) => {
        const provider = Profile.init({ processId: ProfileId });
        const p = await provider.getInfo();
        profiles[ProfileId] = p;
      }),
    );
    console.log(profiles);

    this.set({
      profiles: Object.entries(profiles).reduce(
        (acc: Record<string, AoProfile>, [profileId, profile]: any, i) => {
          if (i === 0) {
            this.setProfile(profile as AoProfile);
            this.set({
              profileProvider: Profile.init({
                processId: profileId,
                signer: signer as any,
              }),
            });
          }
          acc[profileId] = profile;
          return acc;
        },
        {},
      ),
    });
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
