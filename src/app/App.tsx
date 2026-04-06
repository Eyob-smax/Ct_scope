import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import Dashboard from '../components/dashboard/Dashboard';
import IssueList from '../components/issues/IssueList';
import IssueDetail from '../components/issues/IssueDetail';
import MapView from '../components/map/MapView';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import IoTSensors from '../components/iot/IoTSensors';
import UserManagement from '../components/users/UserManagement';
import AuditLogs from '../components/users/AuditLogs';
import Settings from '../components/layout/Settings';
import Notifications from '../features/notifications/components/Notifications';
import Reports from '../components/shared/Reports';
import SignupAdminPage from '../pages/auth/SignupAdminPage';
import LoginPage from '../pages/auth/LoginPage';
import { TooltipProvider } from '../components/ui/tooltip';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';
import { ProtectedRoute } from '../components/shared/ProtectedRoute';

function Unauthorized() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">403 - Unauthorized</h1>
      <p className="text-muted-foreground">You do not have permission to access this page.</p>
      <a href="/" className="text-primary hover:underline">Return to Dashboard</a>
    </div>
  );
}

function ThemeProvider({ children, ...props }: ThemeProviderProps & { children: React.ReactNode }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/signup-admin" element={<SignupAdminPage />} />
              <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="issues" element={<IssueList />} />
                <Route path="issues/:id" element={<IssueDetail />} />
                <Route path="map" element={<MapView />} />
                <Route path="analytics" element={<AnalyticsDashboard />} />
                <Route path="sensors" element={<IoTSensors />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="audit-logs" element={<AuditLogs />} />
                <Route path="settings" element={<Settings />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="reports" element={<Reports />} />
                <Route path="unauthorized" element={<Unauthorized />} />
              </Route>
            </Routes>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
