import React from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Database, 
  Shield,
  Save,
  Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuthStore } from '../../hooks/useAuth';
import { UserRole } from '../../types';

export default function Settings() {
  const { user, loginAsRole } = useAuthStore();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and system preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" /> Profile</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Lock className="h-4 w-4" /> Security</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="system" className="gap-2"><Globe className="h-4 w-4" /> System</TabsTrigger>
          <TabsTrigger value="rbac" className="gap-2"><Shield className="h-4 w-4" /> RBAC Demo</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
              <CardDescription>Update your personal information and how others see you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                    <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{user.role.replace('_', ' ')} • {user.region}</p>
                  <Button variant="outline" size="sm" className="mt-2">Change Avatar</Button>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue={user.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+251 911 223344" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Assigned Region</Label>
                  <Input id="region" defaultValue={user.region} disabled />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Manage your password and account protection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Switch />
              </div>

              <div className="flex justify-end">
                <Button className="gap-2"><Save className="h-4 w-4" /> Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control which alerts you receive and how.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive daily summaries and critical alerts via email.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive real-time alerts in your browser.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive critical infrastructure failure alerts via SMS.</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Global system settings (Admin only).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input id="platformName" defaultValue="CitiScope Ethiopia" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Input id="timezone" defaultValue="East Africa Time (UTC+3)" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2"><Database className="h-4 w-4" /> Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">Perform daily database backups at 2:00 AM.</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-end">
                <Button className="gap-2"><Save className="h-4 w-4" /> Save System Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rbac" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RBAC Demo Mode</CardTitle>
              <CardDescription>Switch between roles to test the dashboard's access control features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(['federal_admin', 'regional_admin', 'zonal_admin', 'woreda_admin', 'technician'] as UserRole[]).map((role) => (
                  <Button 
                    key={role}
                    variant={user.role === role ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col items-start gap-1"
                    onClick={() => loginAsRole(role)}
                  >
                    <span className="font-bold capitalize">{role.replace('_', ' ')}</span>
                    <span className="text-xs opacity-70">Test as {role}</span>
                  </Button>
                ))}
              </div>
              
              <Separator />
              
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-semibold text-sm">Current Scoping:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-muted-foreground">Region:</div>
                  <div>{user.region}</div>
                  <div className="text-muted-foreground">Zone:</div>
                  <div>{user.zone}</div>
                  <div className="text-muted-foreground">Woreda:</div>
                  <div>{user.woreda}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
