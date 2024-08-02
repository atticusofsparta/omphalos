function Button({
  children,
  classes,
  onClick,
  disabled,
  sound,
}: {
  children?: React.ReactNode;
  classes?: string;
  onClick?: (e: any) => void;
  disabled?: boolean;
  sound?: Howl;
}) {
  return (
    <button
      onClick={(e) => {
        if (sound) sound.play();
        if (onClick) {
          onClick(e);
        }
      }}
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
