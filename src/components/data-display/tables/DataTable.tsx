import {
  ColumnDef,
  ColumnSort,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { TbChevronDown, TbChevronUp } from 'react-icons/tb';

import Placeholder from './Placeholder';

const TableView = <T, S>({
  columns,
  data,
  defaultSortingState,
  isLoading,
  noDataFoundText = 'No data found.',
  onRowClick,
}: {
  columns: ColumnDef<T, S>[];
  data: T[];
  defaultSortingState: ColumnSort;
  isLoading: boolean;
  noDataFoundText?: string;
  onRowClick?: (row: T) => void;
}) => {
  const [sorting, setSorting] = useState<SortingState>([defaultSortingState]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel<T>(),
    getSortedRowModel: getSortedRowModel(), //provide a sorting row model
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <>
      <div className="overflow-x-auto scrollbar">
        <table className="w-full table-auto border-x border-b border-matrix bg-night-sky-thin">
          <thead className="text-low text-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortState = header.column.getIsSorted();
                  return (
                    <th key={header.id} className="py-2 pl-6">
                      <button
                        className="flex items-center gap-1 text-left"
                        onClick={() => {
                          setSorting([
                            {
                              id: header.column.id,
                              desc: sortState
                                ? sortState === 'desc'
                                  ? false
                                  : true
                                : header.column.columnDef.sortDescFirst ?? true,
                            },
                          ]);
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {sortState ? (
                          sortState === 'desc' ? (
                            <TbChevronDown />
                          ) : (
                            <TbChevronUp />
                          )
                        ) : (
                          <div className="w-4" />
                        )}
                      </button>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="text-sm">
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className={`cursor-pointer border-t border-foregroundThin text-matrix backdrop-blur-sm *:py-4 *:pl-6 hover:bg-forest-green-thin hover:text-primary ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                >
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isLoading && (
        <div className="border-grey-500 text-low flex items-center justify-center border-x border-b px-6 py-4">
          <Placeholder className="w-full" />
        </div>
      )}
      {!isLoading && table.getRowCount() === 0 && (
        <div className="border-grey-500 text-low flex h-[6.25rem] items-center justify-center border-x border-b">
          {noDataFoundText}
        </div>
      )}
    </>
  );
};

export default TableView;
