import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertCircle, 
  Map as MapIcon, 
  BarChart3, 
  Cpu, 
  Users, 
  FileText, 
  Settings, 
  History,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../hooks/useUI';
import { useAuthStore } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { canAccessRoute } from '../../config/permissions';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: AlertCircle, label: 'Issues', path: '/issues' },
  { icon: MapIcon, label: 'Map', path: '/map' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Cpu, label: 'IoT Monitoring', path: '/sensors' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: History, label: 'Audit Logs', path: '/audit-logs' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, role } = useAuthStore();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
      
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-20"
        )}
      >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {sidebarOpen ? (
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <ShieldCheck className="h-8 w-8" />
            <span>CitiScope</span>
          </div>
        ) : (
          <ShieldCheck className="h-8 w-8 mx-auto text-primary" />
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="hidden md:flex"
        >
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)] py-4">
        <nav className="space-y-2 px-2">
          {navItems.filter(item => canAccessRoute(role, item.path)).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                !sidebarOpen && "justify-center px-0"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      {sidebarOpen && user && (
        <div className="absolute bottom-0 left-0 w-full border-t bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">{user.name}</span>
              <span className="text-xs text-muted-foreground truncate">{user.role.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
    </>
  );
}
