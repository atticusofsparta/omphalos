import { useGlobalState } from '@src/services/state/useGlobalState';

import Modal from './Modal';

function SigningModal() {
  const signing = useGlobalState((state) => state.signing);

  return (
    <Modal
      visible={signing}
      containerClasses="p-10 flex flex-row justify-center items-center bg-night-sky-thin shadow-foregroundThin z-50"
      modalClasses="bg-night-sky text-primary w-[500px] h-[200px] flex flex-col justify-center items-center p-10 rounded-lg border-primary border-2 shadow-primaryThin"
    >
      Signing Transaction, please wait.
    </Modal>
  );
}

export default SigningModal;
