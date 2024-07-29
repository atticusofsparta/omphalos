import { AOProcess } from '@ar.io/sdk';

export type AoProfileRegistryProcess = {
  updateProfile(): Promise<string>;
  getProfilesByAddress({ address }: { address: string }): Promise<string[]>;
  getMetadataByProfileIds({
    profileIds,
  }: {
    profileIds: string[];
  }): Promise<Record<string, any>>;
};

export type AoProfileProcess = {
  updateProfile({
    name,
    avatar,
  }: {
    name: string;
    avatar: string;
  }): Promise<string>;
  transfer(): Promise<string>;
  addUploadedAsset(): Promise<string>;
};
