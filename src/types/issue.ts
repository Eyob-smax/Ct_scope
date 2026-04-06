export type IssueCategory = 'road' | 'water' | 'electricity' | 'garbage' | 'drainage';
export type IssueStatus = 'reported' | 'verified' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  latitude: number;
  longitude: number;
  region: string;
  zone: string;
  woreda: string;
  reportedBy: string; // User ID or Name
  assignedTo?: string; // User ID
  createdAt: string;
  updatedAt: string;
  images: string[];
}
