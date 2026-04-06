import React from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Info,
  MoreHorizontal,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';

import { mockNotifications } from '../../../services/mock';

export default function Notifications() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with real-time alerts and system events.</p>
        </div>
        <Button variant="outline">Mark all as read</Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Notifications</CardTitle>
          <Badge variant="secondary">{mockNotifications.filter(n => !n.read).length} Unread</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="divide-y">
              {mockNotifications.map((n) => (
                <div key={n.id} className={`p-4 flex gap-4 transition-colors hover:bg-muted/50 ${!n.read ? 'bg-primary/5' : ''}`}>
                  <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    n.type === 'urgent' ? 'bg-red-100 text-red-600' : 
                    n.type === 'warning' ? 'bg-orange-100 text-orange-600' : 
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {n.type === 'urgent' ? <AlertCircle className="h-4 w-4" /> : 
                     n.type === 'warning' ? <AlertCircle className="h-4 w-4" /> : 
                     <Info className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${!n.read ? 'text-primary' : ''}`}>{n.title}</p>
                      <span className="text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-2 pt-2">
                      {!n.read && <Button variant="ghost" size="sm" className="h-7 text-[10px]">Mark as read</Button>}
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] text-destructive">Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
