import { create } from 'zustand';

export interface JobPosting {
  facility: string;
  address: string;
  employment_type: '常勤' | '非常勤' | '契約社員' | '未指定' | '';
  url: string;
  source: 'ハローワーク' | 'ジョブメドレー' | '人材バンク' | 'Indeed';
  posted_at: string;
}

export interface JobFilters {
  employment_type: string;
  source: string;
  address_filter: string;
}

interface JobsStore {
  jobs: JobPosting[];
  allJobs: JobPosting[];
  favorites: Set<string>;
  loading: boolean;
  error: string | null;
  filters: JobFilters;
  sortConfig: {
    key: keyof JobPosting;
    direction: 'asc' | 'desc';
  } | null;
  setJobs: (jobs: JobPosting[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<JobFilters>) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  toggleFavorite: (jobUrl: string) => void;
  isFavorite: (jobUrl: string) => boolean;
  getFavoriteJobs: () => JobPosting[];
  sortJobs: (key: keyof JobPosting) => void;
}

export const useJobsStore = create<JobsStore>((set, get) => ({
  jobs: [],
  allJobs: [],
  favorites: new Set(JSON.parse(localStorage.getItem('jobFavorites') || '[]')),
  loading: false,
  error: null,
  filters: {
    employment_type: '',
    source: '',
    address_filter: ''
  },
  sortConfig: null,
  
  setJobs: (jobs) => set({ jobs, allJobs: jobs }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  setFilters: (newFilters) => {
    const { filters } = get();
    const updatedFilters = { ...filters, ...newFilters };
    set({ filters: updatedFilters });
    get().applyFilters();
  },
  
  applyFilters: () => {
    const { allJobs, filters } = get();
    let filteredJobs = [...allJobs];
    
    if (filters.employment_type) {
      filteredJobs = filteredJobs.filter(job => 
        job.employment_type === filters.employment_type
      );
    }
    
    if (filters.source) {
      filteredJobs = filteredJobs.filter(job => 
        job.source === filters.source
      );
    }
    
    if (filters.address_filter) {
      filteredJobs = filteredJobs.filter(job => 
        job.address.toLowerCase().includes(filters.address_filter.toLowerCase())
      );
    }
    
    set({ jobs: filteredJobs });
  },
  
  clearFilters: () => {
    const { allJobs } = get();
    set({
      filters: {
        employment_type: '',
        source: '',
        address_filter: ''
      },
      jobs: allJobs
    });
  },
  
  toggleFavorite: (jobUrl) => {
    const { favorites } = get();
    const newFavorites = new Set(favorites);
    
    if (newFavorites.has(jobUrl)) {
      newFavorites.delete(jobUrl);
    } else {
      newFavorites.add(jobUrl);
    }
    
    localStorage.setItem('jobFavorites', JSON.stringify([...newFavorites]));
    set({ favorites: newFavorites });
  },
  
  isFavorite: (jobUrl) => {
    const { favorites } = get();
    return favorites.has(jobUrl);
  },
  
  getFavoriteJobs: () => {
    const { allJobs, favorites } = get();
    return allJobs.filter(job => favorites.has(job.url));
  },
  
  sortJobs: (key) => {
    const { jobs, sortConfig } = get();
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    const sortedJobs = [...jobs].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      
      if (key === 'posted_at') {
        const aDate = new Date(aValue).getTime();
        const bDate = new Date(bValue).getTime();
        return direction === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    set({
      jobs: sortedJobs,
      sortConfig: { key, direction }
    });
  }
}));