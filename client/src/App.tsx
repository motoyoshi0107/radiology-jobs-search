import { useState } from 'react';
import { JobTable } from './components/JobTable';
import { JobFilters } from './components/JobFilters';
import { useJobsStore } from './store/useJobs';
import { Search, RefreshCw } from 'lucide-react';

function App() {
  const [keyword, setKeyword] = useState('');
  const { loading, error, setJobs, setLoading, setError, getFavoriteJobs } = useJobsStore();

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError('検索キーワードを入力してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/scrape?keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'エラーが発生しました');
      }

      setJobs(data.jobs);
      
      if (data.errors.length > 0) {
        setError(`一部のサイトでエラーが発生しました: ${data.errors.join(', ')}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const loadStoredJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'エラーが発生しました');
      }

      setJobs(data.jobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const loadFavoriteJobs = () => {
    const favoriteJobs = getFavoriteJobs();
    setJobs(favoriteJobs);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            診療放射線技師求人検索
          </h1>
          <p className="text-gray-600">
            ハローワーク、ジョブメドレー、医療ワーカー人材バンク、Indeedから求人を横断検索
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-2">
                検索キーワード
              </label>
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="例: 東京都、新宿区、CT など"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>{loading ? '検索中...' : '検索'}</span>
              </button>
              <button
                onClick={loadStoredJobs}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存済み表示
              </button>
              <button
                onClick={loadFavoriteJobs}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                お気に入り
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
        </div>

        <JobFilters />

        <div className="bg-white rounded-lg shadow-md">
          <JobTable />
        </div>
      </div>
    </div>
  );
}

export default App;