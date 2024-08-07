import { ReactNode } from 'react';

function Card({
  children,
  classes = '',
}: {
  children: ReactNode;

  classes?: string;
}) {
  return (
    <div className={'flex flex-col rounded-lg ' + classes}>{children}</div>
  );
}

export default Card;
