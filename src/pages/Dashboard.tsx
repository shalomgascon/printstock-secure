import { Package, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { LowStockAlerts } from '@/components/dashboard/LowStockAlerts';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/security';

export default function Dashboard() {
  const { user } = useAuth();

  // Mock dashboard data
  const stats = {
    totalInventoryItems: 156,
    lowStockItems: 4,
    pendingOrders: 12,
    totalInventoryValue: 485750,
  };

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Good {getGreeting()}, {user?.name?.split(' ')[0]}!
        </h2>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your inventory today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 stagger-children">
        <StatCard
          title="Total Inventory Items"
          value={stats.totalInventoryItems}
          subtitle="Active SKUs"
          icon={Package}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          subtitle="Need reordering"
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          subtitle="Awaiting processing"
          icon={ShoppingCart}
          variant="default"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Inventory Value"
          value={formatCurrency(stats.totalInventoryValue)}
          subtitle="Total stock value"
          icon={TrendingUp}
          variant="success"
          trend={{ value: 5.2, isPositive: true }}
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrders />
        <LowStockAlerts />
      </div>

      {/* Activity feed */}
      <ActivityFeed />
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}
