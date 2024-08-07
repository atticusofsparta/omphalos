import { OmphalosProject } from '@src/services/ao/profiles/Profile';
import { useGlobalState } from '@src/services/state/useGlobalState';
import { useState } from 'react';
import { TbX } from 'react-icons/tb';

import Button from '../buttons/Button';
import Modal from './Modal';

function CreateProjectModal() {
  const showCreateProjectModal = useGlobalState(
    (s) => s.showCreateProjectModal,
  );
  const setShowCreateProjectModal = useGlobalState(
    (s) => s.setShowCreateProjectModal,
  );
  const profileProvider = useGlobalState((s) => s.profileProvider);

  const [newProject, setNewProject] = useState<OmphalosProject>({});

  function handleClose() {
    setShowCreateProjectModal(false);
  }

  return (
    <Modal
      visible={showCreateProjectModal}
      containerClasses="bg-[rgb(0,0,0,0.5)] flex flex-col items-center justify-center w-full h-full"
      modalClasses="bg-[rgb(0,0,0,0.5)] flex flex-col w-[75%] h-[90%] p-4 rounded-lg border-2 border-primary shadow-primaryThin"
    >
      <div className="flex w-full flex-row justify-between">
        <h1 className="text-2xl text-secondary">Create Project</h1>
        <Button classes="text-3xl text-secondary" onClick={() => handleClose()}>
          <TbX />
        </Button>
      </div>
    </Modal>
  );
}

export default CreateProjectModal;
