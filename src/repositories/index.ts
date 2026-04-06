import { authService } from '../services/api/auth.service';
import { adminService } from '../services/api/admin.service';
import { issuesService } from '../services/api/issues.service';
import { technicianService } from '../services/api/technician.service';
import { Issue, User } from '../types';
import { AuthResponse, LoginRequest, SignupRequest, DashboardResponse } from '../types/api';

export const AuthRepository = {
  login: (data: LoginRequest): Promise<AuthResponse> => authService.login(data),
  signup: (data: SignupRequest): Promise<AuthResponse> => authService.signup(data),
  signupAdmin: (data: SignupRequest): Promise<AuthResponse> => authService.signupAdmin(data),
  signupEmployee: (data: SignupRequest): Promise<AuthResponse> => authService.signupEmployee(data),
  logout: (): Promise<any> => authService.logout(),
  refreshToken: (token: string): Promise<AuthResponse> => authService.refreshToken(token),
};

export const AdminRepository = {
  getDashboard: (): Promise<DashboardResponse> => adminService.getDashboard(),
  getScopedIssues: (): Promise<Issue[]> => adminService.getScopedIssues(),
  getPendingIssues: (): Promise<Issue[]> => adminService.getPendingIssues(),
  assignIssue: (issueId: string, technicianId: string): Promise<any> => 
    adminService.assignIssue(issueId, technicianId),
  getTechnicians: (): Promise<User[]> => adminService.getTechnicians(),
};

export const IssuesRepository = {
  createIssue: (data: any): Promise<Issue> => issuesService.createIssue(data),
  getMyIssues: (): Promise<Issue[]> => issuesService.getMyIssues(),
  searchIssues: (query: string): Promise<Issue[]> => issuesService.searchIssues(query),
  getIssueById: (id: string): Promise<Issue> => issuesService.getIssueById(id),
  voteIssue: (issueId: string): Promise<any> => issuesService.voteIssue(issueId),
};

export const TechnicianRepository = {
  getTasks: (): Promise<Issue[]> => technicianService.getTasks(),
  getUnassignedTasks: (): Promise<Issue[]> => technicianService.getUnassignedTasks(),
  getFinishedTasks: (): Promise<Issue[]> => technicianService.getFinishedTasks(),
  acceptTask: (id: string): Promise<any> => technicianService.acceptTask(id),
  startTask: (id: string): Promise<any> => technicianService.startTask(id),
  completeTask: (id: string): Promise<any> => technicianService.completeTask(id),
};
