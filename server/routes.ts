import { Router } from 'express';
import { scrapeHellowork } from './scrapers/hellowork.js';
import { scrapeJobmedley } from './scrapers/jobmedley.js';
import { scrapeJinzaibank } from './scrapers/jinzaibank.js';
import { scrapeIndeed } from './scrapers/indeed.js';
import { insertJobs, getAllJobs } from './database.js';
import { JobPosting, ScrapeResult } from './types.js';

const router = Router();

// 全求人データ取得
router.get('/api/jobs', async (req, res) => {
  try {
    const jobs = getAllJobs.all() as JobPosting[];
    res.json({ jobs, total: jobs.length });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// スクレイピング実行
router.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword as string;
  
  if (!keyword) {
    return res.status(400).json({ error: 'keyword parameter is required' });
  }
  
  console.log(`Starting scrape for keyword: ${keyword}`);
  
  const scrapers = [
    { name: 'ハローワーク', fn: scrapeHellowork },
    { name: 'ジョブメドレー', fn: scrapeJobmedley },
    { name: '人材バンク', fn: scrapeJinzaibank },
    { name: 'Indeed', fn: scrapeIndeed }
  ];
  
  const results = await Promise.allSettled(
    scrapers.map(async (scraper) => {
      console.log(`Scraping ${scraper.name}...`);
      const timeoutPromise = new Promise<JobPosting[]>((_, reject) => 
        setTimeout(() => reject(new Error(`${scraper.name} timeout`)), 15000)
      );
      
      try {
        const jobs = await Promise.race([
          scraper.fn(keyword),
          timeoutPromise
        ]);
        console.log(`${scraper.name}: Found ${jobs.length} jobs`);
        return jobs;
      } catch (error) {
        console.error(`${scraper.name} error:`, error);
        throw error;
      }
    })
  );
  
  const allJobs: JobPosting[] = [];
  const errors: string[] = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allJobs.push(...result.value);
    } else {
      errors.push(`${scrapers[index].name}: ${result.reason.message}`);
    }
  });
  
  console.log(`Total jobs found: ${allJobs.length}`);
  
  // DBに保存
  if (allJobs.length > 0) {
    try {
      insertJobs(allJobs);
      console.log('Jobs saved to database');
    } catch (error) {
      console.error('Error saving jobs to database:', error);
      errors.push('Database save error');
    }
  }
  
  const response: ScrapeResult = {
    jobs: allJobs,
    errors,
    totalFound: allJobs.length
  };
  
  res.json(response);
});

export default router;