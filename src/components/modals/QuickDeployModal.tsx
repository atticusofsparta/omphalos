import { DEFAULT_ARWEAVE } from '@src/constants';
import { errorEmitter } from '@src/services/events';
import { useGlobalState } from '@src/services/state/useGlobalState';
import { uploadBuildFolder } from '@src/services/uploaders/turbo';
import { ArconnectSigner, DataItem } from 'arbundles';
import Ar from 'arweave/node/ar';
import { Tag } from 'arweave/web/lib/transaction';
import { useState } from 'react';
import { TbInfoCircle, TbOutbound, TbX } from 'react-icons/tb';

import Button from '../buttons/Button';
import Card from '../cards/Card';
import Tooltip from '../data-display/Tooltip';
import FileInput from '../inputs/file/FileInput';
import Modal from './Modal';

function QuickDeployModal() {
  const showQuickDeployModal = useGlobalState((s) => s.showQuickDeployModal);
  const setShowQuickDeployModal = useGlobalState(
    (s) => s.setShowQuickDeployModal,
  );
  const setSigning = useGlobalState((s) => s.setSigning);
  const wallet = useGlobalState((s) => s.wallet);

  const [files, setFiles] = useState<File[]>([]);
  const [manifestId, setManifestId] = useState<string | undefined>();

  function handleClose() {
    setFiles([]);
    setManifestId(undefined);
    setShowQuickDeployModal(false);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const fileLength = e.target.files?.length;
    let files: File[] = [];
    if (!fileLength) return;
    for (let i = 0; i < fileLength; i++) {
      const file = e.target.files?.item(i);
      console.log(file);
      if (file) files.push(file);
    }
    setFiles(files);
  }

  async function handleUpload() {
    try {
      setSigning(true);
      if (!wallet?.arconnectSigner) {
        throw new Error(
          'Login before uploading your build files, you need to connect your wallet',
        );
      }
      const signer = new ArconnectSigner(
        wallet?.arconnectSigner as any,
        DEFAULT_ARWEAVE as any,
      ) as any;
      await signer?.setPublicKey();
      const tx = await uploadBuildFolder({
        files,
        tags: [new Tag('App-Name', 'Omphalos')],
        signer,
      });
      setManifestId(tx.manifestId);
    } catch (error) {
      errorEmitter.emit('error', error);
    } finally {
      setSigning(false);
    }
  }

  return (
    <Modal
      visible={showQuickDeployModal}
      containerClasses="bg-[rgb(0,0,0,0.5)] flex flex-col items-center justify-center w-full h-full"
      modalClasses="bg-[rgb(0,0,0,0.5)] flex flex-col w-[75%] h-[90%] p-4 rounded-lg border-4 border-foreground gap-4 shadow-matrix"
    >
      <div className="flex w-full flex-row justify-between">
        <h1 className="flex flex-row items-center gap-4 text-xl text-success">
          Deploy it right the fudge now, fast as shitake mushrooms.{' '}
          <Tooltip
            message={
              <span className="m-2 flex rounded-lg border-2 border-success bg-night-sky-thin p-2 text-secondary shadow-matrixThin">
                This is where you can upload your build files. You can drag and
                drop them here or click to select them from your file system.
                Your build files are intended to be the output of your website
                or project, which will be indexed by "index.html"
              </span>
            }
          >
            <TbInfoCircle />
          </Tooltip>
        </h1>
        <Button classes="text-3xl text-secondary" onClick={() => handleClose()}>
          <TbX />
        </Button>
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        {!manifestId ? (
          <FileInput
            accept="*"
            multiple={true}
            onChange={(f) => handleInput(f)}
            variant="rectangle"
            classes="w-full h-full flex flex-col items-center justify-center border-success text-success"
            icon={<></>}
            acceptFolder={true}
          >
            <div className="flex h-full flex-row">
              {!files ? (
                <h1 className="flex flex-row items-center gap-4 text-3xl text-success">
                  Drop your build here or click to upload
                </h1>
              ) : (
                <h1 className="flex flex-row items-center gap-4 text-3xl text-success">
                  {files.length} files selected
                </h1>
              )}
            </div>
          </FileInput>
        ) : (
          <div className="flex h-fit w-fit flex-col items-center justify-center rounded-md border-2 border-success bg-matrixThin p-4 shadow-matrixThin">
            <a
              href={`https://arweave.net/${manifestId}`}
              target="_blank"
              rel="noreferrer"
            >
              <Card classes="flex flex-col w-fit h-fit items-center justify-center">
                <h1 className="text-md flex flex-row items-center justify-center gap-4 text-success">
                  Manifest ID <TbOutbound className="text-2xl" />
                </h1>
                <p className="text-md text-success">{manifestId}</p>
              </Card>
            </a>
          </div>
        )}
        {files && files.length > 0 && !manifestId && (
          <Button
            onClick={() => handleUpload()}
            classes="w-full p-4 flex flex-row justify-center items-center bg-matrixThin hover:animate-none hover:bg-forest-green-thin rounded-lg border-2 border-success animate-pulse text-success"
          >
            Deploy
          </Button>
        )}
      </div>
    </Modal>
  );
}

export default QuickDeployModal;
