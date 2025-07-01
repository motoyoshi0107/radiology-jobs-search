import { useJobsStore } from '../store/useJobs';
import { Filter, X } from 'lucide-react';

export function JobFilters() {
  const { filters, setFilters, clearFilters, allJobs } = useJobsStore();

  // 利用可能なフィルターオプションを取得
  const employmentTypes = [...new Set(allJobs.map(job => job.employment_type).filter(Boolean))];
  const sources = [...new Set(allJobs.map(job => job.source))];

  const hasActiveFilters = filters.employment_type || filters.source || filters.address_filter;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">フィルター</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4" />
            <span>クリア</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 雇用形態フィルター */}
        <div>
          <label htmlFor="employment-filter" className="block text-sm font-medium text-gray-700 mb-1">
            雇用形態
          </label>
          <select
            id="employment-filter"
            value={filters.employment_type}
            onChange={(e) => setFilters({ employment_type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">すべて</option>
            {employmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* 掲載元フィルター */}
        <div>
          <label htmlFor="source-filter" className="block text-sm font-medium text-gray-700 mb-1">
            掲載元
          </label>
          <select
            id="source-filter"
            value={filters.source}
            onChange={(e) => setFilters({ source: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">すべて</option>
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>

        {/* 地域フィルター */}
        <div>
          <label htmlFor="address-filter" className="block text-sm font-medium text-gray-700 mb-1">
            地域
          </label>
          <input
            id="address-filter"
            type="text"
            value={filters.address_filter}
            onChange={(e) => setFilters({ address_filter: e.target.value })}
            placeholder="例: 東京都、新宿区"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* フィルター結果の表示 */}
      {hasActiveFilters && (
        <div className="mt-4 text-sm text-gray-600">
          <span>アクティブフィルター: </span>
          {filters.employment_type && (
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
              雇用形態: {filters.employment_type}
            </span>
          )}
          {filters.source && (
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
              掲載元: {filters.source}
            </span>
          )}
          {filters.address_filter && (
            <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded mr-2">
              地域: {filters.address_filter}
            </span>
          )}
        </div>
      )}
    </div>
  );
}