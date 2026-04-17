import { authService } from '../services/api/auth.service';
import { adminService } from '../services/api/admin.service';
import { issuesService, CreateIssueInput } from '../services/api/issues.service';
import { technicianService } from '../services/api/technician.service';
import { Issue, User } from '../types';
import { AuthResponse, LoginRequest, SignupRequest, DashboardResponse } from '../types/api';

export const AuthRepository = {
  login: (data: LoginRequest): Promise<AuthResponse> => authService.login(data),
  signup: (data: SignupRequest): Promise<unknown> => authService.signup(data),
  signupAdmin: (data: SignupRequest): Promise<unknown> => authService.signupAdmin(data),
  signupEmployee: (data: SignupRequest): Promise<unknown> => authService.signupEmployee(data),
  logout: (): Promise<unknown> => authService.logout(),
  refreshToken: (token: string): Promise<AuthResponse> => authService.refreshToken(token),
};

export const AdminRepository = {
  getDashboard: (): Promise<DashboardResponse> => adminService.getDashboard(),
  getScopedIssues: (): Promise<Issue[]> => adminService.getScopedIssues(),
  getPendingIssues: (): Promise<Issue[]> => adminService.getPendingIssues(),
  assignIssue: (issueId: string, technicianId: string): Promise<Issue> =>
    adminService.assignIssue(issueId, technicianId),
  getTechnicians: (): Promise<User[]> => adminService.getTechnicians(),
};

export const IssuesRepository = {
  createIssue: (data: CreateIssueInput, imageFile?: File): Promise<Issue> =>
    issuesService.createIssue(data, imageFile),
  getMyIssues: (): Promise<Issue[]> => issuesService.getMyIssues(),
  searchIssues: (params?: Record<string, string | number | undefined>): Promise<Issue[]> =>
    issuesService.searchIssues(params),
  getIssueById: (id: string): Promise<Issue> => issuesService.getIssueById(id),
  voteIssue: (issueId: string) => issuesService.voteIssue(issueId),
};

export const TechnicianRepository = {
  getTasks: (): Promise<Issue[]> => technicianService.getTasks(),
  getUnfinishedTasks: (): Promise<Issue[]> => technicianService.getUnfinishedTasks(),
  getFinishedTasks: (): Promise<Issue[]> => technicianService.getFinishedTasks(),
  acceptTask: (id: string) => technicianService.acceptTask(id),
  startTask: (id: string) => technicianService.startTask(id),
  completeTask: (id: string) => technicianService.completeTask(id),
};
