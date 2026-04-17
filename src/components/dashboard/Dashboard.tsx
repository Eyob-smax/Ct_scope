import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Users, 
  MapPin,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { mockChartData, mockIssues, mockAnalyticsSummary } from '../../services/mock';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Link } from 'react-router-dom';
import { Chart } from '../shared/Chart';
import { useDashboard, useScopedIssues } from '../../hooks/api/useAdmin';

export default function Dashboard() {
  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useDashboard();
  const { data: issues = [], isLoading: isIssuesLoading } = useScopedIssues();

  if (isDashboardLoading || isIssuesLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Loading dashboard data...</span>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Failed to load dashboard</h2>
        <p className="text-muted-foreground">Please check your connection and try again.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const totals = dashboardData?.totals;
  const openIssues = (totals?.reported ?? 0) + (totals?.verified ?? 0);

  const stats = [
    { label: 'Total Issues', value: (totals?.total ?? 0).toLocaleString(), icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Open Issues', value: openIssues.toLocaleString(), icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'In Progress', value: (totals?.in_progress ?? 0).toLocaleString(), icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Resolved', value: (totals?.resolved ?? 0).toLocaleString(), icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  const statusData = [
    { name: 'Open', value: openIssues, color: '#ef4444' },
    { name: 'In Progress', value: totals?.in_progress ?? 0, color: '#f59e0b' },
    { name: 'Resolved', value: totals?.resolved ?? 0, color: '#10b981' },
  ];

  const categoryPalette: Record<string, string> = {
    road: '#3b82f6',
    water: '#0ea5e9',
    electricity: '#eab308',
    waste: '#f97316',
    drainage: '#8b5cf6',
    public_facility: '#14b8a6',
    other: '#94a3b8',
  };
  const fallbackCategoryData = [
    { name: 'Road', value: 40, color: categoryPalette.road },
    { name: 'Water', value: 30, color: categoryPalette.water },
    { name: 'Electricity', value: 20, color: categoryPalette.electricity },
    { name: 'Waste', value: 10, color: categoryPalette.waste },
    { name: 'Drainage', value: 5, color: categoryPalette.drainage },
  ];
  const categoryData = dashboardData?.by_category?.length
    ? dashboardData.by_category.map((row) => ({
        name: row.category.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        value: row.count,
        color: categoryPalette[row.category] ?? categoryPalette.other,
      }))
    : fallbackCategoryData;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">National Multi-Tier Civic Intelligence Platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Last 24 Hours
          </Button>
          <Button size="sm">
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className={`rounded-full p-2 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-green-500">
                <TrendingUp className="h-3 w-3" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Issue Trends</CardTitle>
            <CardDescription>Daily reported vs resolved issues.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="issues" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorIssues)" />
                  <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Issues by Status</CardTitle>
            <CardDescription>Current distribution of issue states.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Issues by Category</CardTitle>
            <CardDescription>Infrastructure types distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Latest infrastructure issues submitted.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/issues">View All <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.slice(0, 5).map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-mono text-xs">{issue.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{issue.title}</span>
                        <span className="text-xs text-muted-foreground">{issue.woreda}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {issue.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={issue.priority === 'urgent' ? 'destructive' : 'secondary'} className="text-[10px] capitalize">
                        {issue.priority}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
