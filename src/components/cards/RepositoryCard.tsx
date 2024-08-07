import { Repository } from '@saber2pr/types-github-api';
import { TbOutbound } from 'react-icons/tb';

import Card from './Card';

function RepositoryCard({ repo }: { repo: Repository }) {
  const {
    name,
    private: isPrivate,
    html_url: url,
    created_at,
    pushed_at,
    size,
    license,
  } = repo;

  return (
    <Card classes="cursor-pointer">
      <div className="flex flex-col gap-1 rounded-lg border-2 border-matrix bg-[rgb(0,0,0,0.5)] p-2 text-matrix shadow-matrixThin">
        <h3 className="text-xl font-bold text-foreground">{name}</h3>
        <p>{isPrivate ? 'Private' : 'Public'}</p>
        <a
          href={url}
          className="flex flex-row items-center gap-2 text-success"
          target="_blank"
          rel="noopener noreferrer"
        >
          Repository Link <TbOutbound />
        </a>
        <p>Created At: {new Date(created_at).toLocaleDateString()}</p>
        <p>Last Pushed At: {new Date(pushed_at).toLocaleDateString()}</p>
        <p>Size: {size} KB</p>
        {license && <p>License: {license.name}</p>}
      </div>
    </Card>
  );
}

export default RepositoryCard;
