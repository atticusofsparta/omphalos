import { Repositories, Repository } from '@saber2pr/types-github-api';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import TableView from './DataTable';

interface TableData {
  name: string;
  description: string;
  owner: string;
  url: string;
  forks: number;
  watchers: number;
  stars: number;
}

const columnHelper = createColumnHelper<TableData>();

const GithubReposTable = ({
  repos,
  loading,
}: {
  repos: Repositories;
  loading: boolean;
}) => {
  const [tableData, setTableData] = useState<Array<TableData>>([]);

  useEffect(() => {
    if (repos) {
      const newTableData = repos.map((repo: Repository) => ({
        name: repo.name,
        description: repo.description,
        owner: repo.owner.login,
        url: repo.html_url,
        forks: repo.forks,
        watchers: repo.watchers,
        stars: repo.stargazers_count,
      }));

      setTableData(newTableData as TableData[]);
    }
  }, [repos, loading]);

  // Define columns for the table
  const columns: ColumnDef<TableData, any>[] = [
    'name',
    'description',
    'owner',
    'url',
    'forks',
    'watchers',
    'stars',
  ].map((key) =>
    columnHelper.accessor(key as keyof TableData, {
      id: key,
      header: key,
      sortDescFirst: true,
    }),
  );

  return (
    <div>
      <div className="flex w-full items-center rounded-t-lg border border-matrix bg-night-sky-thin py-[0.9375rem] pl-6 pr-[0.8125rem]">
        <div className="text-mid grow text-sm text-foreground">
          Repositories of{' '}
          <span className="text-primary">{repos?.[0]?.owner.login}</span> from
          github
        </div>
      </div>
      <TableView
        columns={columns}
        data={tableData || []}
        isLoading={loading}
        noDataFoundText="No repositories found."
        defaultSortingState={{ id: 'name', desc: true }}
      />
    </div>
  );
};

export default GithubReposTable;
