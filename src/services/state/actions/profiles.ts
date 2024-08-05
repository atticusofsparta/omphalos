import { PROFILE_REGISTRY_ID } from '@src/constants';
import {
  AoProfileRegistryReadable,
  ProfileAssociation,
  ProfileRegistry,
} from '@src/services/ao/profiles/ProfileRegistry';

export async function getProfileAssociations({
  address,
  registry = ProfileRegistry.init({ processId: PROFILE_REGISTRY_ID }),
}: {
  address: string;
  registry?: AoProfileRegistryReadable;
}): Promise<ProfileAssociation[]> {
  return await registry.getProfilesByAddress({ address });
}
