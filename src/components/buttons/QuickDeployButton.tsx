import { useGlobalState } from '@src/services/state/useGlobalState';
import { TbRocket } from 'react-icons/tb';

import Tooltip from '../data-display/Tooltip';
import Button from './Button';

function QuickDeployButton() {
  const setShowQuickDeployModal = useGlobalState(
    (s) => s.setShowQuickDeployModal,
  );

  return (
    <Button
      onClick={() => setShowQuickDeployModal(true)}
      classes="p-2 h-fit text-3xl text-secondary rounded-full bg-forest-green-thin border-[1px] border-matrix shadow-matrixThin"
    >
      <Tooltip
        message={
          <span className="m-2 flex rounded-lg border-2 border-primary bg-night-sky p-2 text-matrix shadow-primaryThin">
            Quick deploy your project
          </span>
        }
      >
        <TbRocket className="text-success" />
      </Tooltip>
    </Button>
  );
}

export default QuickDeployButton;
