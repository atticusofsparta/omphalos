import Button from '@src/components/buttons/Button';
import DomainCard from '@src/components/cards/DomainCard';
import ProjectCard from '@src/components/cards/ProjectCard';
import RepositoryCard from '@src/components/cards/RepositoryCard';
import InlineTextInput from '@src/components/inputs/text/InlineTextInput';
import useArNS from '@src/hooks/useArNS';
import useGithub from '@src/hooks/useGithub';
import { useGlobalState } from '@src/services/state/useGlobalState';
import { useState } from 'react';
import { BiSolidComponent } from 'react-icons/bi';
import { GiElephant } from 'react-icons/gi';
import { TbBrandGit } from 'react-icons/tb';

function Overview() {
  const { repositories, loading } = useGithub();
  const { domains } = useArNS();
  const profile = useGlobalState((s) => s.profile);
  const setShowCreateProjectModal = useGlobalState(
    (s) => s.setShowCreateProjectModal,
  );
  const projects = profile?.Projects ?? {
    omphalos: {
      v1: {
        location: 'https://github.com/project-kardeshev/omphalos',
        dateCreated: '2021-10-01',
        lastUpdated: '2021-10-01',
        transactionId: '0x1234567890'.padEnd(43, '0'),
      },
      v2: {
        location: 'https://github.com/project-kardeshev/omphalos',
        dateCreated: '2022-10-01',
        lastUpdated: '2021-10-01',
        transactionId: '0x1234567890'.padEnd(43, '0'),
      },
    },
    domphalos2: {
      v1: {
        location: 'https://github.com/project-kardeshev/omphalos',
        dateCreated: '2021-10-01',
        lastUpdated: '2021-10-01',
        transactionId: '0x1234567890'.padEnd(43, '0'),
      },
      v2: {
        location: 'https://github.com/project-kardeshev/omphalos',
        dateCreated: '2022-10-01',
        lastUpdated: '2021-10-01',
        transactionId: '0x1234567890'.padEnd(43, '0'),
      },
    },
  };
  const [search, setSearch] = useState<string>('');

  return (
    <div className="flex h-full w-full flex-col gap-6 p-8">
      <div className="flex w-full flex-row gap-4">
        {/* toolbar */}
        {/* project search */}
        <InlineTextInput
          classes="flex flex-row p-3 text-matrix w-full bg-[rgb(0,0,0,0.7)] rounded-lg"
          value={search}
          setValue={(v: string) => setSearch(v)}
          placeholder="Search for a repository, project, or domain..."
        />

        <Button
          onClick={() => setShowCreateProjectModal(true)}
          classes="p-3 rounded-lg hover:bg-forest-green-thin bg-night-sky-thin text-foregroundThin hover:text-foreground hover:border-foreground border-[1px] border-foregroundThin whitespace-nowrap"
        >
          New Project
        </Button>
      </div>
      {/* main body */}
      <div className="flex h-[600px] w-full flex-row">
        {/* repos */}
        <div className="flex h-full w-full flex-col gap-4 overflow-y-scroll p-4 scrollbar">
          <div className="flex w-full flex-row py-4">
            <span className="flex flex-row items-center gap-2 text-2xl font-bold text-secondary">
              Repositories <TbBrandGit className="text-3xl text-success" />
            </span>
          </div>
          {repositories?.map((repo) => {
            if (repo.name.startsWith(search)) {
              return <RepositoryCard repo={repo} />;
            }
          })}
        </div>
        {/* projects */}
        <div className="flex h-full w-full flex-col gap-4 overflow-y-scroll p-4 scrollbar">
          <div className="flex w-full flex-row py-4">
            <span className="flex flex-row items-center gap-2 text-2xl font-bold text-secondary">
              Projects <BiSolidComponent className="text-3xl text-matrix" />
            </span>
          </div>
          {Object.entries(projects).map(([name, project]) => {
            if (name.startsWith(search)) {
              return <ProjectCard name={name} project={project} />;
            }
          })}
        </div>
        {/* domains */}
        <div className="flex h-full w-full flex-col gap-4 overflow-y-scroll p-4 scrollbar">
          <div className="flex w-full flex-row py-4">
            <span className="flex flex-row items-center gap-2 text-2xl font-bold text-secondary">
              Domains <GiElephant className="text-5xl text-secondary" />
            </span>
          </div>
          {Object.entries(domains).map(([domain, record]) => {
            if (domain.startsWith(search)) {
              return <DomainCard domain={domain} record={record} />;
            }
          })}
        </div>
      </div>
    </div>
  );
}
3;

export default Overview;
