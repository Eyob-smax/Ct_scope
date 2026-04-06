import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Calendar, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  History,
  CheckCircle2,
  AlertTriangle,
  Send,
  Camera,
  ExternalLink
} from 'lucide-react';
import { mockIssues, mockUsers } from '../../services/mock';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const issue = mockIssues.find(i => i.id === id) || mockIssues[0];
  const reporter = mockUsers.find(u => u.id === issue.reportedBy);
  const technician = mockUsers.find(u => u.id === issue.assignedTo);

  const timeline = [
    { status: 'reported', date: issue.createdAt, user: reporter?.name || 'Reporter', details: 'Issue submitted via mobile app.' },
    { status: 'verified', date: '2024-03-19T16:30:00Z', user: 'Sara Tesfaye', details: 'Issue verified by regional admin.' },
    { status: 'assigned', date: '2024-03-20T08:00:00Z', user: 'Abebe Bikila', details: 'Assigned to technician Kebede Kassahun.' },
    { status: 'in_progress', date: issue.updatedAt, user: technician?.name || 'Technician', details: 'Technician on site. Repair started.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/issues"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{issue.title}</h1>
            <Badge variant="outline" className="font-mono">{issue.id}</Badge>
          </div>
          <p className="text-muted-foreground">Detailed view and management of infrastructure issue.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Issue Information</CardTitle>
                <div className="flex gap-2">
                  <Badge variant={issue.priority === 'urgent' ? 'destructive' : 'secondary'} className="capitalize">
                    {issue.priority} Priority
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 capitalize">
                    {issue.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {issue.description}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Location Details
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{issue.woreda}, {issue.zone}</p>
                    <p className="text-muted-foreground">{issue.region}, Ethiopia</p>
                    <p className="text-xs text-muted-foreground">Coordinates: {issue.latitude}, {issue.longitude}</p>
                    <Button variant="link" className="p-0 h-auto text-xs" asChild>
                      <a href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`} target="_blank" rel="noreferrer">
                        View on Google Maps <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" /> Reporter Details
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{reporter?.name || issue.reportedBy}</p>
                    <p className="text-muted-foreground">{reporter?.phone || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground pt-1">Reported via CitiScope Mobile</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Camera className="h-4 w-4" /> Evidence & Photos
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {issue.images.map((img, i) => (
                    <div key={i} className="group relative aspect-video rounded-lg overflow-hidden border bg-muted">
                      <img src={img} alt="Evidence" className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Discussion & Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>ST</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 rounded-lg bg-muted p-3 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">Sara Tesfaye</span>
                      <span className="text-[10px] text-muted-foreground">2 hours ago</span>
                    </div>
                    <p>Verified the site location. The damage is more extensive than initially reported. We need extra materials for the repair.</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Input placeholder="Write a comment..." className="flex-1" />
                <Button size="icon"><Send className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-muted">
                {timeline.map((item, i) => (
                  <div key={i} className="relative pl-8">
                    <div className={cn(
                      "absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-background flex items-center justify-center",
                      i === timeline.length - 1 ? "bg-primary" : "bg-muted"
                    )}>
                      {i === timeline.length - 1 && <div className="h-2 w-2 rounded-full bg-background" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold capitalize">{item.status.replace('_', ' ')}</p>
                        <span className="text-[10px] text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.details}</p>
                      <p className="text-[10px] font-medium text-primary">By {item.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {technician ? (
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Avatar>
                    <AvatarFallback>{technician.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{technician.name}</p>
                    <p className="text-xs text-muted-foreground">Technician</p>
                  </div>
                  <Button variant="ghost" size="sm">Change</Button>
                </div>
              ) : (
                <Button className="w-full">Assign Technician</Button>
              )}
              <Button variant="outline" className="w-full">Update Status</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5" /> Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[200px]">
                <div className="p-4 space-y-4">
                  <div className="text-xs space-y-1">
                    <p className="font-medium">Status changed to IN_PROGRESS</p>
                    <p className="text-muted-foreground">By Kebede Kassahun • 1 hour ago</p>
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-medium">Technician assigned</p>
                    <p className="text-muted-foreground">By Abebe Bikila • 3 hours ago</p>
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-medium">Issue verified</p>
                    <p className="text-muted-foreground">By Sara Tesfaye • 1 day ago</p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
