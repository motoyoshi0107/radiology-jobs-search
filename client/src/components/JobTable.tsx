import { useJobsStore } from '../store/useJobs';
import { ChevronUp, ChevronDown, ExternalLink, Heart } from 'lucide-react';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export function JobTable() {
  const { jobs, sortConfig, sortJobs, toggleFavorite, isFavorite } = useJobsStore();

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const columns = [
    { key: 'favorite' as const, label: '' },
    { key: 'facility' as const, label: '施設名' },
    { key: 'address' as const, label: '住所' },
    { key: 'employment_type' as const, label: '雇用形態' },
    { key: 'source' as const, label: '掲載元' },
    { key: 'posted_at' as const, label: '掲載日' },
    { key: 'url' as const, label: 'リンク' }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => column.key !== 'url' && column.key !== 'favorite' && sortJobs(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.key !== 'url' && column.key !== 'favorite' && getSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {jobs.map((job, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <button
                  onClick={() => toggleFavorite(job.url)}
                  className={`p-1 rounded hover:bg-gray-100 ${
                    isFavorite(job.url) ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  <Heart 
                    className={`w-5 h-5 ${isFavorite(job.url) ? 'fill-current' : ''}`} 
                  />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {job.facility}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {job.address}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  job.employment_type === '常勤' 
                    ? 'bg-green-100 text-green-800' 
                    : job.employment_type === '非常勤'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {job.employment_type || '未指定'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {job.source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(job.posted_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>詳細</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {jobs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          求人情報がありません
        </div>
      )}
    </div>
  );
}