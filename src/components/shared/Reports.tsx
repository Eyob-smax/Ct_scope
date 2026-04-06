import React from 'react';
import { 
  FileText, 
  Download, 
  FileJson, 
  Table as TableIcon, 
  FileSpreadsheet,
  Filter,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

const reportTypes = [
  { id: 'ISSUE_SUMMARY', title: 'Issue Summary Report', description: 'Comprehensive summary of all issues reported, resolved, and pending.', icon: FileText },
  { id: 'REGIONAL_PERF', title: 'Regional Performance', description: 'Detailed analysis of resolution rates and response times by region.', icon: FileSpreadsheet },
  { id: 'IOT_ANALYTICS', title: 'IoT Sensor Analytics', description: 'Historical data and trends from all active infrastructure sensors.', icon: TableIcon },
  { id: 'AUDIT_TRAIL', title: 'System Audit Trail', description: 'Full history of administrative actions for compliance and security.', icon: FileJson },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Exports</h1>
        <p className="text-muted-foreground">Generate and export detailed system data for offline analysis.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Export</CardTitle>
            <CardDescription>Export current system state in various formats.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button variant="outline" className="flex flex-col h-auto py-4 gap-2">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <span>Export CSV</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4 gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                <span>Export PDF</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4 gap-2">
                <FileJson className="h-5 w-5 text-blue-600" />
                <span>Export JSON</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Report Builder</CardTitle>
            <CardDescription>Select parameters to generate a custom report.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1 justify-start">
                <Calendar className="mr-2 h-4 w-4" /> Select Date Range
              </Button>
              <Button variant="outline" className="flex-1 justify-start">
                <Filter className="mr-2 h-4 w-4" /> Filter by Region
              </Button>
            </div>
            <Button className="w-full">Generate Custom Report</Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold pt-4">Available Report Templates</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((report) => (
          <Card key={report.id} className="group cursor-pointer transition-all hover:border-primary hover:shadow-md">
            <CardHeader className="p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <report.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">{report.title}</CardTitle>
              <CardDescription className="text-xs line-clamp-2">{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button variant="ghost" size="sm" className="w-full justify-between text-xs px-0">
                Generate Report <ChevronRight className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
