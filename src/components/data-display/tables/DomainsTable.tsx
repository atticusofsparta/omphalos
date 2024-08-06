import { AoArNSNameData } from '@ar.io/sdk';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import TableView from './DataTable';

interface TableData {
  name: string;
  startTimestamp: number;
  endTimestamp: string;
  undernames: number;
}

const columnHelper = createColumnHelper<TableData>();

const DomainsTable = ({
  domains,
  loading,
}: {
  domains: Record<string, AoArNSNameData>;
  loading: boolean;
}) => {
  const [tableData, setTableData] = useState<Array<TableData>>([]);

  useEffect(() => {
    if (domains) {
      const newTableData = Object.entries(domains).map(
        ([arnsName, record]) => ({
          name: arnsName,
          startTimestamp: record.startTimestamp,
          endTimestamp: (record as any)?.endTimestamp ?? 'Permanent',
          undernames: record.undernameLimit,
        }),
      );

      setTableData(newTableData as TableData[]);
    }
  }, [domains, loading]);

  // Define columns for the table
  const columns: ColumnDef<TableData, any>[] = [
    'name',
    'startTimestamp',
    'endTimestamp',
    'undernames',
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
          ArNS Domains
        </div>
      </div>
      <TableView
        columns={columns}
        data={tableData || []}
        isLoading={loading}
        noDataFoundText="No domains found."
        defaultSortingState={{ id: 'startTimestamp', desc: true }}
      />
    </div>
  );
};

export default DomainsTable;
