import { ReactNode } from 'react';
import { TbUpload } from 'react-icons/tb';

function FileInput({
  setValue,
  classes = '',
  disabled = false,
  variant = 'circle',
  accept,
  icon = <TbUpload size={30} />,
  children,
  multiple = false,
  name,
}: {
  setValue: (value?: File) => void;
  classes?: string;
  disabled?: boolean;
  variant?: 'circle' | 'rectangle';
  accept?: string;
  icon?: JSX.Element;
  children?: ReactNode;
  multiple?: boolean;
  name?: string;
}) {
  const rectangleClasses =
    'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed';
  const circleClasses =
    'min-h-[75px] min-w-[75px] flex cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed';
  return (
    <div className="flex w-full">
      <label
        htmlFor={'dropzone-file' + '-' + name}
        className={
          (variant === 'circle' ? circleClasses : rectangleClasses) +
          ' ' +
          classes
        }
      >
        <div className="flex flex-col items-center justify-center">
          {icon}
          {children}
        </div>
        <input
          id={'dropzone-file' + '-' + name}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={(f) => setValue(f.target.files?.[0])}
          disabled={disabled}
        />
      </label>
    </div>
  );
}

export default FileInput;
