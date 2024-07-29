import { copyToClipboard } from '@src/utils';
import { useEffect, useState } from 'react';
import { TbCopy, TbCopyCheckFilled } from 'react-icons/tb';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  function handleCopy() {
    try {
      copyToClipboard(text);
      setCopied(true);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <button
      onClick={handleCopy}
      className="justify-center p-2 text-xl text-foregroundSubtle drop-shadow-md transition-all hover:rounded hover:text-foreground"
    >
      {copied ? <TbCopyCheckFilled /> : <TbCopy />}
    </button>
  );
}

export default CopyButton;
