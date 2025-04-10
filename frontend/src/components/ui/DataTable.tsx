import { cn } from '../../lib/utils';

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
  }[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

function DataTable<T>({
  data,
  columns,
  onRowClick,
  isLoading = false,
  emptyMessage = "No data available"
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-sm rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                "hover:bg-gray-50",
                onRowClick ? "cursor-pointer" : ""
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column, colIndex) => {
                const cellContent =
                  typeof column.accessor === "function"
                    ? column.accessor(item)
                    : (item[column.accessor] as React.ReactNode);

                return (
                  <td
                    key={colIndex}
                    className={cn("px-6 py-4 whitespace-nowrap text-sm", column.className)}
                  >
                    {cellContent}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
