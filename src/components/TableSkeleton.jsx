export default function TableSkeleton({ columns, rows }) {
  return (
    <div className="bg-white w-full shadow-md rounded-md overflow-hidden overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
            {columns.map((column) => (
              <th key={column} className="p-2">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t border-gray-200 ">
              {columns.map((column, columnIndex) => (
                <td
                  key={`${rowIndex}-${columnIndex}`}
                  className="p-4 text-sm text-gray-500"
                >
                  <div className="h-6 w-32 animate-pulse bg-gray-300 rounded-full"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
