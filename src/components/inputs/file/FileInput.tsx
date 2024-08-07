import { ChangeEventHandler, ReactNode } from 'react';
import { TbUpload } from 'react-icons/tb';

function FileInput({
  onChange,
  classes = '',
  disabled = false,
  variant = 'circle',
  accept,
  icon = <TbUpload size={30} />,
  children,
  multiple = false,
  name,
  acceptFolder = false,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>;
  classes?: string;
  disabled?: boolean;
  variant?: 'circle' | 'rectangle';
  accept?: string;
  icon?: JSX.Element;
  children?: ReactNode;
  multiple?: boolean;
  name?: string;
  acceptFolder?: boolean;
}) {
  const rectangleClasses =
    'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed';
  const circleClasses =
    'min-h-[75px] min-w-[75px] flex cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed';
  return (
    <div className="flex h-full w-full">
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
        {acceptFolder ? (
          <input
            id={'dropzone-file' + '-' + name}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={onChange}
            disabled={disabled}
            // @ts-ignore
            directory=""
            webkitdirectory=""
            mozdirectory=""
          />
        ) : (
          <input
            id={'dropzone-file' + '-' + name}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={onChange}
            disabled={disabled}
          />
        )}
      </label>
    </div>
  );
}

export default FileInput;
