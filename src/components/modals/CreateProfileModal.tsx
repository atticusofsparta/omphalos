import { Profile, spawnProfile } from '@src/services/ao/profiles/Profile';
import { errorEmitter } from '@src/services/events';
import { useGlobalState } from '@src/services/state/useGlobalState';
import {
  camelToReadable,
  encryptStringWithPublicKey,
  uploadImage,
} from '@src/utils';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { TbInfoCircle, TbUpload } from 'react-icons/tb';

import Button from '../buttons/Button';
import Tooltip from '../data-display/Tooltip';
import FileInput from '../inputs/FileInput';
import InlineTextInput from '../inputs/text/InlineTextInput';
import { bloopSound } from '../navigation/Navbar';
import Modal from './Modal';

/**
 * Requirements:
 * - cover image (add/remove)
 * - profile image (add/remove)
 * - Name (displayName)
 * - Handle (username)
 * - Bio (description)
 * - git integrations (github, gitlab, protocol.land, etc)
 * ---------- ADVANCED ----------
 * - API keys (github, openAI, google, twitter, facebook, linkedin, youtube), appendable, this section gets encrypted with public key
 * - Custom tags for process (including registry ID)
 */

export type GitUsername = string;
export type GitIntegration = {
  username: string;
  apiKey: string;
};
export type SupportedGitIntegrations = 'github' | 'gitlab';
export type CreateProfileForm = {
  coverImage: string;
  profileImage: string;
  displayName: string;
  username: string;
  description: string;
  gitIntegrations: Record<SupportedGitIntegrations, GitIntegration>;
};

export const defaultCreateProfileForm: CreateProfileForm = {
  coverImage: '',
  profileImage: '',
  displayName: '',
  username: '',
  description: '',
  gitIntegrations: {
    github: {
      username: '',
      apiKey: '',
    },
    gitlab: {
      username: '',
      apiKey: '',
    },
  },
};
function CreateProfileModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState<CreateProfileForm>(
    defaultCreateProfileForm,
  );
  const address = useGlobalState((s) => s.address);
  const setSigning = useGlobalState((s) => s.setSigning);
  const signer = useGlobalState((s) => s.aoSigner);
  const wallet = useGlobalState((s) => s.wallet);
  const updateProfiles = useGlobalState((s) => s.updateProfiles);

  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        event.target &&
        modalRef.current &&
        !modalRef.current.contains(event.target as any)
      ) {
        setShowModal(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef, showModal]);

  function handleFormChange(
    v: string | File | undefined,
    key: keyof CreateProfileForm,
  ) {
    if (key === 'coverImage' || key === 'profileImage') {
      if (v instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (key === 'coverImage') {
            setCoverImage(e.target?.result as string);
          } else {
            setProfileImage(e.target?.result as string);
          }
        };

        reader.readAsDataURL(v);

        return;
      }
    }

    setFormState((state) => ({
      ...state,
      [key]: v,
    }));
  }
  function handleGitIntegration(
    integration: SupportedGitIntegrations,
    key: keyof GitIntegration,
    v: string,
  ) {
    setFormState((state) => ({
      ...state,
      gitIntegrations: {
        ...state.gitIntegrations,
        [integration]: {
          ...state.gitIntegrations[integration],
          [key]: v,
        },
      },
    }));
  }

  async function createProfile() {
    try {
      setSigning(true);
      const newProfile = formState;
      if (newProfile.coverImage) {
        const coverId = await uploadImage(
          newProfile.coverImage,
          wallet?.arconnectSigner!,
        );
        newProfile.coverImage = coverId;
      }
      if (newProfile.profileImage) {
        const profileId = await uploadImage(
          newProfile.coverImage,
          wallet?.arconnectSigner!,
        );
        newProfile.profileImage = profileId;
      }
      const gitIntegrations = newProfile.gitIntegrations;

      for (const gitName of Object.keys(gitIntegrations)) {
        if (gitIntegrations[gitName as SupportedGitIntegrations].apiKey) {
          const encryptedApiKey = await encryptStringWithPublicKey(
            gitIntegrations[gitName as SupportedGitIntegrations].apiKey,
            await wallet?.arconnectSigner?.getActivePublicKey()!,
          );
          gitIntegrations[gitName as SupportedGitIntegrations].apiKey =
            encryptedApiKey;
        }
      }
      newProfile.gitIntegrations = gitIntegrations;
      if (!address) throw new Error('No address found');
      if (!wallet?.arconnectSigner || !signer)
        throw new Error('No signer found');
      const id = await spawnProfile({
        profileSettings: formState as Profile,
        address,
        signer: wallet?.arconnectSigner,
      });

      await updateProfiles(address, signer, wallet.arconnectSigner!);
      setShowModal(false);
    } catch (error) {
      errorEmitter.emit('error', error);
    } finally {
      setSigning(false);
      setFormState(defaultCreateProfileForm);
    }
  }
  const inputClasses = `bg-[rgb(0,0,0,0.8)] text-primary placeholder:text-sm text-md dark:focus:ring-foreground dark:focus:border-foreground flex flex-row p-1 rounded-md border-2 border-black`;
  return (
    <Modal
      visible={showModal}
      modalClasses="bg-night-sky border-2 border-primary rounded-lg shadow-primaryThin m-4"
    >
      <div
        ref={modalRef}
        className="scrollbar-track-slate-300 scrollbar-h-50 flex max-h-[70vh] w-[700px] flex-col gap-4 overflow-y-scroll p-6 scrollbar scrollbar-thumb-primaryThin scrollbar-thumb-rounded-full scrollbar-w-2"
      >
        <div className="flex h-fit w-[600px] w-full flex-col gap-2 text-secondary">
          <h1 className="rounded-md border-[1px] border-primary p-2 text-xl font-bold text-secondary shadow-primaryThinBottom">
            Create Profile
          </h1>
          {/* inputs */}
          <div className="flex w-full flex-col gap-4">
            <div className="relative flex">
              <FileInput
                icon={<></>}
                disabled={!showModal}
                name="coverImage"
                classes={
                  'w-full relative h-[300px] flex flex-col items-center justify-center border-foregroundThin bg-[rgba(0,0,0,0.8)]'
                }
                variant="rectangle"
                setValue={(v) => handleFormChange(v as any, 'coverImage')}
              >
                {/* render upload here */}
                <div className="absolute flex h-full w-full items-center justify-center">
                  {coverImage ? (
                    <img src={coverImage} className="flex h-full w-full" />
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <TbUpload size={30} />
                      Select a cover image to upload
                    </div>
                  )}
                </div>
              </FileInput>
              <div className="absolute bottom-[-30px] right-[-10px]">
                <FileInput
                  icon={<></>}
                  disabled={!showModal}
                  classes={
                    'w-[150px] relative h-[150px] border-foregroundThin p-4 flex flex-col items-center justify-center border-secondary bg-[rgba(0,0,0,0.8)] z-10'
                  }
                  variant="circle"
                  name="profileImage"
                  setValue={(v) => handleFormChange(v as any, 'profileImage')}
                >
                  {/* render upload here */}
                  <div className="absolute flex h-full w-full items-center justify-center">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        className="flex h-full w-full rounded-full"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <TbUpload size={30} />
                        Profile Image
                      </div>
                    )}
                  </div>
                </FileInput>
              </div>
            </div>
            {Object.keys(formState).map((key: string) => {
              if (key == 'coverImage' || key === 'profileImage') {
                return;
              } else if (key === 'gitIntegrations') {
                return (
                  <div className="flex flex-col text-xl">
                    <span className="flex w-full items-center justify-center">
                      <span className="flex flex-row items-center justify-center gap-2">
                        {camelToReadable(key)}
                        <Tooltip
                          message={
                            <span className="m-2 flex rounded-lg border-2 border-primary bg-night-sky p-2 text-matrix shadow-primaryThin">
                              Git integrations allow Omphalos to access your
                              repositories. API keys should be generated from
                              your providers (eg github, gitlab, etc) user
                              settings - for security, ensure that only READ
                              permissions are enabled. Note that Omphalos will
                              encrypt your API key with your connected wallet's
                              public key and store it in your profile. Certain
                              integrations (like automated action setup) may
                              require WRITE permissions.
                            </span>
                          }
                        >
                          <motion.div onMouseEnter={() => bloopSound.play()}>
                            <TbInfoCircle className="cursor-pointer hover:text-matrix" />
                          </motion.div>
                        </Tooltip>
                      </span>
                    </span>
                    {Object.keys(formState.gitIntegrations).map((gitKey) => (
                      <div className="flex flex-col gap-2">
                        <span className="flex flex-col gap-2 text-lg">
                          {camelToReadable(gitKey)}
                        </span>
                        {Object.keys(
                          formState.gitIntegrations[
                            gitKey as SupportedGitIntegrations
                          ],
                        ).map((subKey) => {
                          return (
                            <InlineTextInput
                              key={subKey}
                              title={camelToReadable(subKey)}
                              classes={inputClasses}
                              placeholder={`Enter ${gitKey} ${camelToReadable(subKey)}`}
                              value={
                                formState.gitIntegrations[
                                  gitKey as SupportedGitIntegrations
                                ][subKey as keyof GitIntegration] as string
                              }
                              setValue={(v) =>
                                handleGitIntegration(
                                  gitKey as SupportedGitIntegrations,
                                  subKey as keyof GitIntegration,
                                  v,
                                )
                              }
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <InlineTextInput
                  key={key}
                  title={camelToReadable(key)}
                  classes={inputClasses}
                  placeholder={camelToReadable(key)}
                  value={formState[key as keyof CreateProfileForm] as string}
                  setValue={(v) => handleFormChange(v, key as any)}
                />
              );
            })}
          </div>
        </div>

        {/* footer */}
        <div className="flex w-full flex-row items-center justify-between">
          <Button
            classes="p-1 rounded-md bg-secondary border-2 border-black text-black flex w-fit hover:bg-ocean-blue-thin transition-all"
            onClick={() => {
              setFormState(defaultCreateProfileForm);
              setCoverImage(undefined);
              setProfileImage(undefined);
            }}
          >
            Reset
          </Button>
          <div className="flex flex-row gap-2">
            <Button
              classes="text-black border-2 border-black bg-secondaryThin rounded-md p-1 hover:bg-secondary transition-all"
              onClick={() => {
                setFormState(defaultCreateProfileForm);
                setShowModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              classes="text-primary border-2 border-primary rounded-md p-1 bg-forest-green-thin hover:bg-sunset-orange hover:text-black transition-all"
              onClick={() => createProfile()}
            >
              Create
            </Button>{' '}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default CreateProfileModal;
