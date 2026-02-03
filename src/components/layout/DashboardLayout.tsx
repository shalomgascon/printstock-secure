import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inventory': 'Inventory Management',
  '/orders': 'Order Management',
  '/suppliers': 'Suppliers',
  '/reports': 'Reports',
  '/users': 'User Management',
  '/activity': 'Activity Log',
  '/settings': 'Settings',
};

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'PrintFlow';

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Detect sidebar collapse from CSS
  useEffect(() => {
    const checkSidebarWidth = () => {
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        setSidebarCollapsed(sidebar.offsetWidth < 100);
      }
    };

    // Create observer for sidebar width changes
    const observer = new MutationObserver(checkSidebarWidth);
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      observer.observe(sidebar, { attributes: true, attributeFilter: ['class', 'style'] });
    }

    checkSidebarWidth();

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn('lg:block', sidebarOpen ? 'block' : 'hidden lg:block')}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
