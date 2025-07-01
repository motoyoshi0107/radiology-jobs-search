import { JobPosting } from './types.js';

// メモリベースの簡単なデータベース
let jobsStorage: JobPosting[] = [];

export const insertJobs = (jobs: JobPosting[]) => {
  // 重複を防ぐためにURLでフィルタリング
  const existingUrls = new Set(jobsStorage.map(job => job.url));
  const newJobs = jobs.filter(job => !existingUrls.has(job.url));
  
  jobsStorage.push(...newJobs);
  
  // 古いジョブを削除（100件まで保持）
  if (jobsStorage.length > 100) {
    jobsStorage = jobsStorage.slice(-100);
  }
  
  return newJobs.length;
};

export const getAllJobs = {
  all: () => jobsStorage.sort((a, b) => 
    new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
  )
};

export const getJobsBySource = {
  all: (source: string) => jobsStorage
    .filter(job => job.source === source)
    .sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime())
};

export const clearOldJobs = () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  jobsStorage = jobsStorage.filter(job => 
    new Date(job.posted_at) > oneWeekAgo
  );
};

export default {
  prepare: () => ({
    run: () => {},
    all: () => []
  })
};