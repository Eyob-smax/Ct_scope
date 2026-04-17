export type IssueCategory =
  | 'road'
  | 'water'
  | 'electricity'
  | 'waste'
  | 'drainage'
  | 'public_facility'
  | 'other';

export type IssueStatus = 'reported' | 'verified' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';
export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Issue {
  id: string;
  issueNumber?: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  priorityScore?: number;
  severity?: IssueSeverity;
  latitude: number;
  longitude: number;
  address?: string;
  region: string;
  zone: string;
  woreda: string;
  reportedBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  images: string[];
  imageUrl?: string;
  votes?: number;
}
