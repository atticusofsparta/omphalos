import { captureException } from '@sentry/browser';
import { errorEmitter, notificationEmitter } from '@src/services/events';
import { useGlobalState } from '@src/services/state/useGlobalState';
import { formatArweaveAddress } from '@src/utils';
import { Howl } from 'howler';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { TbCheck, TbSkull } from 'react-icons/tb';

import { menuSound } from '../navigation/ProfileMenu';

const errorSound = new Howl({
  src: ['/sounds/error-female.mp3'],
  volume: 0.2,
  loop: false,
});

const notifyError = (e: string) =>
  toast(JSON.stringify(e), {
    className:
      'bg-errorThin shadow-errorThin border-2 border-error text-secondary p-4',
    icon: <TbSkull className="text-5xl text-error" />,
  });

const notifySuccess = (msg: string) =>
  toast(msg, {
    className:
      'bg-matrixThin shadow-matrixThin border-2 border-matrix text-secondary p-4',
    icon: <TbCheck className="text-2xl text-secondary" />,
  });

function Notifications() {
  const address = useGlobalState((state) => state.address);
  useEffect(() => {
    notificationEmitter.on('notification', (notification) => {
      menuSound.play();
      notifySuccess(notification);
    });

    errorEmitter.on('error', (error) => {
      errorSound.play();
      menuSound.play();
      notifyError(error);
      captureException(error);
    });

    return () => {
      notificationEmitter.removeAllListeners();
      errorEmitter.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (address) {
      notificationEmitter.emit(
        'notification',
        `Connected to ${formatArweaveAddress(address)}`,
      );
    }
  }, [address]);

  return (
    <>
      <Toaster position="bottom-right" />
    </>
  );
}

export default Notifications;
