import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useUIStore } from '../../hooks/useUI';
import { cn } from '../../lib/utils';
import { Toaster } from '../ui/sonner';

export function DashboardLayout() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  React.useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [setSidebarOpen]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        )}
      >
        <Navbar />
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
