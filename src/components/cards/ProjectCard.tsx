import { OmphalosProject } from '@src/services/ao/profiles/Profile';

import Card from './Card';

function ProjectCard({
  name,
  project,
}: {
  name: string;
  project: OmphalosProject;
}) {
  const latestVersion = Object.keys(project).sort().reverse()[0];
  const latest = project[latestVersion];
  return (
    <Card classes="cursor-pointer">
      <div className="flex h-full w-full flex-col rounded-lg border-2 border-primary bg-[rgb(0,0,0,0.5)] text-foreground shadow-primaryThin backdrop-blur-sm hover:border-foreground hover:text-primary hover:shadow-foregroundThin">
        <span className="tex-2xl p-2 font-bold">{name}</span>
        <div className="flex flex-col gap-2">
          <span className="p-2 text-matrix">Location: {latest.location}</span>
          <span className="p-2 text-matrix">
            Date Created: {latest.dateCreated}
          </span>
          <span className="p-2 text-matrix">
            Last Updated: {latest.lastUpdated}
          </span>
          <span className="p-2 text-matrix">
            Transaction ID: {latest.transactionId}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default ProjectCard;
