import { ANTState, AoArNSNameData, AoSigner, createAoSigner } from '@ar.io/sdk';
import { SupportedGitIntegrations } from '@src/components/modals/CreateProfileModal';
import { THEME_TYPES } from '@src/constants';
import { decryptStringWithArconnect } from '@src/utils';
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
import { errorEmitter } from '../events';
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
  domains: Record<string, AoArNSNameData>;
  ants: Record<string, ANTState>;
};

export type GlobalStateActions = {
  setConnecting: (connecting: boolean) => void;
  setSigning: (signing: boolean) => void;
  setShowProfileMenu: (showProfileMenu: boolean) => void;
  setProfile: (profile?: AoProfile) => void;
  setWallet: (wallet?: WalletConnector) => void;
  setAddress: (address?: string) => void;
  setAoSigner: (aoSigner?: AoSigner) => void;
  addDomains: (domains: Record<string, AoArNSNameData>) => void;
  addAnts: (ants: Record<string, ANTState>) => void;
  updateProfiles: (
    address: string,
    signer: AoSigner,
    wallet: Window['arweaveWallet'],
  ) => Promise<void>;
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
  domains: {},
  ants: {},
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
  updateProfiles = async (
    address: string,
    signer: AoSigner,
    wallet: Window['arweaveWallet'],
  ) => {
    const registry = this.initialGlobalState.profileRegistryProvider;
    const profileIds = await registry.getProfilesByAddress({
      address,
    });

    const profiles: Record<string, ProfileInfoResponse> = {};
    await Promise.all(
      profileIds.map(async ({ ProfileId }) => {
        const provider = Profile.init({ processId: ProfileId });
        const p = await provider.getInfo();
        profiles[ProfileId] = p;
        for (const [gitName, integration] of Object.entries(
          p.Profile.GitIntegrations,
        )) {
          try {
            if (integration.apiKey === '') {
              continue;
            }
            const key = await decryptStringWithArconnect(
              integration.apiKey,
              wallet,
            );
            profiles[ProfileId].Profile.GitIntegrations[
              gitName as SupportedGitIntegrations
            ].apiKey = key;
          } catch (error) {
            errorEmitter.emit(
              'error',
              new Error(`Failed to decrypt key for git integration ${gitName}`),
            );
          }
        }
      }),
    );

    this.set({
      profiles: Object.entries(profiles).reduce(
        (acc: Record<string, AoProfile>, [profileId, profile]: any, i) => {
          if (i === 0) {
            this.set({ profileId: profileId });
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
  addDomains = (domains: Record<string, AoArNSNameData>) => {
    this.set((state: GlobalState) => ({
      domains: { ...state.domains, ...domains },
    }));
  };
  addAnts = (ants: Record<string, ANTState>) => {
    this.set((state: GlobalState) => ({ ants: { ...state.ants, ...ants } }));
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
