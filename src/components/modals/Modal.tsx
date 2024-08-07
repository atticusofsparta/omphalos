import { motion } from 'framer-motion';
import { Howl } from 'howler';
import { ForwardedRef, ReactNode } from 'react';

import { menuSound } from '../navigation/ProfileMenu';

function Modal({
  children,
  modalClasses = `border-2 border-foreground shadow-secondaryThin rounded-lg bg-secondaryThin p-4`,
  containerClasses,
  visible,
  sound = menuSound,
}: {
  children?: ReactNode;
  modalClasses?: string;
  containerClasses?: string;
  visible: boolean;
  sound?: Howl;
}) {
  return (
    <motion.div
      animate={{
        opacity: visible ? 1 : 0,
        width: visible ? '100%' : '0%',
        padding: visible ? '1rem' : '0',
      }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onAnimationStart={() => sound?.play()}
      className={`modal-container ${containerClasses}`}
    >
      <motion.div
        animate={{
          y: visible ? 0 : 10000,
          x: visible ? 0 : 100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className={`${modalClasses}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default Modal;
