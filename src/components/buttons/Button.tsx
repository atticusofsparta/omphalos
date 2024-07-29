function Button({
  children,
  classes,
  onClick,
}: {
  children?: React.ReactNode;
  classes?: string;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export default Button;
