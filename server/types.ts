export interface JobPosting {
  facility: string;
  address: string;
  employment_type: '常勤' | '非常勤' | '';
  url: string;
  source: 'ハローワーク' | 'ジョブメドレー' | '人材バンク' | 'Indeed';
  posted_at: string; // ISO8601
}

export interface ScrapeResult {
  jobs: JobPosting[];
  errors: string[];
  totalFound: number;
}

export interface ScraperConfig {
  timeout: number;
  userAgent: string;
  headless: boolean;
}