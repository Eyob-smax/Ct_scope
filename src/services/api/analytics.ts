import { AnalyticsSummary } from '../../types';
import { mockAnalyticsSummary, mockChartData } from '../mock';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  console.log('GET /api/analytics/summary');
  await delay(1000);
  return { ...mockAnalyticsSummary };
};

export const getChartData = async (range: string = '7d'): Promise<any[]> => {
  console.log(`GET /api/analytics/chart?range=${range}`);
  await delay(1200);
  return [...mockChartData];
};

export const getIssuesByCategory = async (): Promise<{ category: string; count: number }[]> => {
  console.log('GET /api/analytics/issues-by-category');
  await delay(800);
  return [
    { category: 'Road', count: 45 },
    { category: 'Water', count: 32 },
    { category: 'Electricity', count: 28 },
    { category: 'Garbage', count: 25 },
    { category: 'Drainage', count: 20 },
  ];
};

export const getIssuesByRegion = async (): Promise<{ region: string; count: number }[]> => {
  console.log('GET /api/analytics/issues-by-region');
  await delay(800);
  return [
    { region: 'Addis Ababa', count: 120 },
    { region: 'Oromia', count: 85 },
    { region: 'Amhara', count: 65 },
    { region: 'Sidama', count: 40 },
    { region: 'Tigray', count: 35 },
  ];
};
