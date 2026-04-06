import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  MapPin,
  User,
  Calendar,
  MessageSquare,
  History,
  Loader2
} from 'lucide-react';
import { mockIssues, mockUsers } from '../../services/mock';
import { Issue, IssueStatus, IssuePriority } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '../ui/sheet';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Link } from 'react-router-dom';
import { DataTable } from '../shared/DataTable';
import { useIssues } from '../../hooks/api/useIssues';

export default function IssueManagement() {
  const { data: issues = [], isLoading, error } = useIssues();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Loading issues...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Failed to load issues</h2>
        <p className="text-muted-foreground">Please check your connection and try again.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         issue.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'reported': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Reported</Badge>;
      case 'verified': return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Verified</Badge>;
      case 'assigned': return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Assigned</Badge>;
      case 'in_progress': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In Progress</Badge>;
      case 'resolved': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
      case 'closed': return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: IssuePriority) => {
    switch (priority) {
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'high': return <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">High</Badge>;
      case 'medium': return <Badge variant="secondary">Medium</Badge>;
      case 'low': return <Badge variant="outline">Low</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Issue Management</h1>
          <p className="text-muted-foreground">Manage and track civic infrastructure issues across all tiers.</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Report New Issue
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID or title..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="reported">Reported</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Issue Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-mono text-xs font-bold">{issue.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{issue.title}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {issue.woreda}, {issue.zone}, {issue.region}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{issue.category}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(issue.status)}</TableCell>
                  <TableCell>{getPriorityBadge(issue.priority)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedIssue(issue)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-[540px]">
                          {selectedIssue && (
                            <div className="h-full flex flex-col">
                              <SheetHeader>
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline" className="font-mono">{selectedIssue.id}</Badge>
                                  {getPriorityBadge(selectedIssue.priority)}
                                </div>
                                <SheetTitle className="text-2xl">{selectedIssue.title}</SheetTitle>
                                <SheetDescription>
                                  Reported on {new Date(selectedIssue.createdAt).toLocaleString()}
                                </SheetDescription>
                              </SheetHeader>
                              
                              <ScrollArea className="flex-1 mt-6 pr-4">
                                <div className="space-y-6">
                                  <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                      <AlertCircle className="h-4 w-4" /> Description
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {selectedIssue.description}
                                    </p>
                                  </div>

                                  <Separator />

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <p className="text-xs text-muted-foreground">Status</p>
                                      {getStatusBadge(selectedIssue.status)}
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-xs text-muted-foreground">Category</p>
                                      <Badge variant="secondary">{selectedIssue.category}</Badge>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                      <MapPin className="h-4 w-4" /> Location
                                    </h4>
                                    <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                                      <p className="font-medium">{selectedIssue.woreda}, {selectedIssue.zone}</p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {selectedIssue.region} (Lat: {selectedIssue.latitude}, Lng: {selectedIssue.longitude})
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                      <User className="h-4 w-4" /> Reporter
                                    </h4>
                                    <div className="flex items-center gap-3 rounded-lg border p-3">
                                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                        {mockUsers.find(u => u.id === selectedIssue.reportedBy)?.name.charAt(0) || 'R'}
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium">{mockUsers.find(u => u.id === selectedIssue.reportedBy)?.name || selectedIssue.reportedBy}</p>
                                        <p className="text-xs text-muted-foreground">{mockUsers.find(u => u.id === selectedIssue.reportedBy)?.phone || 'N/A'}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="text-sm font-semibold">Evidence</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                      {selectedIssue.images.map((img, i) => (
                                        <img key={i} src={img} alt="Evidence" className="rounded-lg object-cover w-full h-32 border" />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </ScrollArea>

                              <SheetFooter className="mt-6 pt-6 border-t gap-2 sm:gap-0">
                                <Button variant="outline" className="flex-1" asChild>
                                  <Link to={`/issues/${selectedIssue.id}`}>Full Details</Link>
                                </Button>
                                <Button className="flex-1">Assign Technician</Button>
                              </SheetFooter>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          </DropdownMenuGroup>
                          <DropdownMenuItem asChild>
                            <Link to={`/issues/${issue.id}`}><Eye className="mr-2 h-4 w-4" /> View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit Issue
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Resolved
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No issues found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
