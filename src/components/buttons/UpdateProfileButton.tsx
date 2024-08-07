import { upgradeProfileForProjectManagement } from '@src/services/ao/profiles/Profile';
import { errorEmitter, notificationEmitter } from '@src/services/events';
import { useGlobalState } from '@src/services/state/useGlobalState';
import { set } from 'lodash';
import { useEffect, useState } from 'react';

import Tooltip from '../data-display/Tooltip';
import Button from './Button';

function UpdateProfileButton({}: {}) {
  const profile = useGlobalState((s) => s.profile);
  const profileId = useGlobalState((s) => s.profileId);
  const wallet = useGlobalState((s) => s.wallet);
  const setSigning = useGlobalState((s) => s.setSigning);
  const updateProfiles = useGlobalState((s) => s.updateProfiles);
  const address = useGlobalState((s) => s.address);
  const aoSigner = useGlobalState((s) => s.aoSigner);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (
      !profile?.Projects == undefined ||
      !profile?.Profile?.GitIntegrations == undefined
    ) {
      setVisible(true);
    }
  }, [profile, address]);

  async function updateProfile() {
    try {
      setSigning(true);
      if (!wallet?.arconnectSigner || !aoSigner || !profileId || !address) {
        throw new Error(
          "I don't know how you got here but that is not possible, connect a wallet first",
        );
      }
      const res = await upgradeProfileForProjectManagement({
        signer: wallet?.arconnectSigner as any,
        profileId,
      });
      notificationEmitter.emit(
        'notification',
        `Profile updated successfully: transaction ID: ${res.id}`,
      );
      console.log(res);
      await updateProfiles(address, aoSigner, wallet?.arconnectSigner);
    } catch (error) {
      errorEmitter.emit('error', error);
    } finally {
      setSigning(false);
    }
  }

  if (!visible || !profile) return <></>;

  return (
    <Tooltip
      message={
        <span className="m-2 flex rounded-lg border-2 border-primary bg-night-sky p-2 text-matrix shadow-primaryThin">
          Update profile to enable project management. This will allow you to
          create, edit, and delete projects.
        </span>
      }
    >
      <Button
        classes="p-4 border-foreground animate-pulse shadow-matrixThin border-2 rounded-md bg-forest-green-thin text-primary hover:shadow-matrix"
        onClick={() => updateProfile()}
      >
        Update Profile
      </Button>
    </Tooltip>
  );
}

export default UpdateProfileButton;
