import {
  Issue,
  IssueCategory,
  IssuePriority,
  IssueSeverity,
  IssueStatus,
  User,
  UserRole,
} from '../../types';
import { DashboardResponse } from '../../types/api';

const VALID_CATEGORIES: readonly IssueCategory[] = [
  'road',
  'water',
  'electricity',
  'waste',
  'drainage',
  'public_facility',
  'other',
];

const VALID_STATUSES: readonly IssueStatus[] = [
  'reported',
  'verified',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
];

const VALID_SEVERITIES: readonly IssueSeverity[] = ['low', 'medium', 'high', 'critical'];

const VALID_ROLES: readonly UserRole[] = [
  'federal_admin',
  'regional_admin',
  'zonal_admin',
  'woreda_admin',
  'technician',
  'employee',
  'citizen',
];

const str = (v: unknown, fallback = ''): string =>
  typeof v === 'string' ? v : v == null ? fallback : String(v);

const num = (v: unknown, fallback = 0): number => {
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : fallback;
};

// Backend uses priority 1–10 (numeric). UI uses a 4-bucket enum.
export const priorityFromScore = (score: number): IssuePriority => {
  if (score >= 9) return 'urgent';
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
};

const coerceCategory = (v: unknown): IssueCategory => {
  const s = str(v, 'other').toLowerCase();
  if (s === 'garbage') return 'waste';
  return (VALID_CATEGORIES as readonly string[]).includes(s) ? (s as IssueCategory) : 'other';
};

const coerceStatus = (v: unknown): IssueStatus => {
  const s = str(v, 'reported').toLowerCase();
  return (VALID_STATUSES as readonly string[]).includes(s) ? (s as IssueStatus) : 'reported';
};

const coerceSeverity = (v: unknown): IssueSeverity | undefined => {
  const s = str(v, '').toLowerCase();
  return (VALID_SEVERITIES as readonly string[]).includes(s) ? (s as IssueSeverity) : undefined;
};

const coerceRole = (v: unknown): UserRole => {
  const s = str(v, 'citizen').toLowerCase();
  return (VALID_ROLES as readonly string[]).includes(s) ? (s as UserRole) : 'citizen';
};

export const mapBackendIssue = (raw: unknown): Issue => {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;

  const priorityScore = num(r.priority, 5);
  const imageUrl = typeof r.image_url === 'string' && r.image_url ? r.image_url : undefined;
  const media = Array.isArray(r.media)
    ? (r.media as Array<Record<string, unknown>>)
        .map((m) => str(m?.media_url))
        .filter(Boolean)
    : [];
  const images = imageUrl ? [imageUrl, ...media.filter((u) => u !== imageUrl)] : media;

  const reportedAt = str(r.reported_at || r.created_at);
  const updatedAt = str(r.updated_at || reportedAt);

  return {
    id: str(r.id),
    issueNumber: typeof r.issue_number === 'string' ? r.issue_number : undefined,
    title: str(r.title),
    description: str(r.description),
    category: coerceCategory(r.category),
    status: coerceStatus(r.status),
    priority: priorityFromScore(priorityScore),
    priorityScore,
    severity: coerceSeverity(r.severity),
    latitude: num(r.latitude),
    longitude: num(r.longitude),
    address: typeof r.address === 'string' ? r.address : undefined,
    region: str(r.region_name),
    zone: str(r.zone_name),
    woreda: str(r.woreda_name),
    reportedBy: str(r.reporter_id ?? r.reporter_name),
    assignedTo: typeof r.assigned_to === 'string' ? r.assigned_to : undefined,
    createdAt: reportedAt,
    updatedAt,
    images,
    imageUrl,
    votes: typeof r.votes === 'number' ? r.votes : undefined,
  };
};

export const mapBackendUser = (raw: unknown): User => {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const fullName = str(r.full_name);
  const isActive = r.is_active === undefined ? true : Boolean(r.is_active);

  return {
    id: str(r.id),
    name: fullName,
    email: str(r.email),
    role: coerceRole(r.role),
    region: '',
    zone: '',
    woreda: '',
    phone: str(r.phone),
    status: isActive ? 'active' : 'inactive',
    fullName,
    isActive,
    isVerified: r.is_verified === undefined ? undefined : Boolean(r.is_verified),
    adminUnitId: typeof r.admin_unit_id === 'string' ? r.admin_unit_id : null,
    language: typeof r.language === 'string' ? r.language : undefined,
  };
};

const defaultDashboard: DashboardResponse = {
  totals: {
    total: 0,
    reported: 0,
    verified: 0,
    assigned: 0,
    in_progress: 0,
    resolved: 0,
  },
  by_category: [],
  high_priority_count: 0,
  avg_resolution_hours: null,
};

export const mapBackendDashboard = (raw: unknown): DashboardResponse => {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const totalsRaw = (r.totals && typeof r.totals === 'object' ? r.totals : {}) as Record<string, unknown>;
  const byCategoryRaw = Array.isArray(r.by_category) ? (r.by_category as Array<Record<string, unknown>>) : [];

  return {
    ...defaultDashboard,
    totals: {
      total: num(totalsRaw.total, 0),
      reported: num(totalsRaw.reported, 0),
      verified: num(totalsRaw.verified, 0),
      assigned: num(totalsRaw.assigned, 0),
      in_progress: num(totalsRaw.in_progress, 0),
      resolved: num(totalsRaw.resolved, 0),
    },
    by_category: byCategoryRaw.map((row) => ({
      category: str(row.category, 'other'),
      count: num(row.count, 0),
    })),
    high_priority_count: num(r.high_priority_count, 0),
    avg_resolution_hours:
      r.avg_resolution_hours == null ? null : num(r.avg_resolution_hours, 0),
  };
};
