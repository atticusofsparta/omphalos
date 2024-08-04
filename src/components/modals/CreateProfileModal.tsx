import { camelToReadable } from '@src/utils';
import { useEffect, useRef, useState } from 'react';
import { TbUpload } from 'react-icons/tb';
import { profile } from 'winston';

import Button from '../buttons/Button';
import FileInput from '../inputs/FileInput';
import InlineTextInput from '../inputs/text/InlineTextInput';
import Modal from './Modal';

/**
 * Requirements:
 * - cover image (add/remove)
 * - profile image (add/remove)
 * - Name (displayName)
 * - Handle (username)
 * - Bio (description)
 * - social links (facebook, twitter, instagram, linkedin, youtube), appendable
 * ---------- ADVANCED ----------
 * - API keys (github, openAI, google, twitter, facebook, linkedin, youtube), appendable, this section gets encrypted with public key
 * - Custom tags for process (including registry ID)
 */

export type CreateProfileForm = {
  coverImage: string;
  profileImage: string;
  displayName: string;
  username: string;
  description: string;
  socialLinks: Record<string, string>;
};

export const defaultCreateProfileForm: CreateProfileForm = {
  coverImage: '',
  profileImage: '',
  displayName: '',
  username: '',
  description: '',
  socialLinks: {
    github: '',
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
        console.log(formState);
        return;
      }
    }
    setFormState((state) => ({
      ...state,
      [key]: v,
    }));
  }
  const inputClasses = `bg-[rgb(0,0,0,0.8)] text-foreground placeholder:text-sm text-md dark:focus:ring-foreground dark:focus:border-foreground flex flex-row p-1 rounded-md border-2 border-black`;
  return (
    <Modal visible={showModal}>
      <div ref={modalRef} className="flex flex-col gap-4">
        <div className="flex h-fit w-[600px] w-full flex-col gap-2 text-secondary">
          <h1 className="text-bold text-xl text-foreground">Create Profile</h1>
          {/* inputs */}
          <div className="flex w-full flex-col gap-4">
            <div className="relative flex">
              <FileInput
                icon={<></>}
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
              if (
                key === 'socialLinks' ||
                key == 'coverImage' ||
                key === 'profileImage'
              ) {
                return;
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
            classes="p-1 rounded-md bg-secondary border-2 border-black text-black flex w-fit hover:bg-warningThin transition-all"
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
              classes="text-black border-2 border-black rounded-md p-1 hover:bg-secondaryThin transition-all"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              classes="text-black border-2 border-black rounded-md p-1 bg-secondary hover:bg-matrixThin transition-all"
              onClick={() => console.log(formState)}
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
