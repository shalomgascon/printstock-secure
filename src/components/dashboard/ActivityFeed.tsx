import { 
  Package, 
  ShoppingCart, 
  UserPlus, 
  AlertTriangle,
  CheckCircle,
  Edit,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'order' | 'inventory' | 'user' | 'alert' | 'complete' | 'edit';
  message: string;
  timestamp: string;
  user?: string;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'order',
    message: 'New order #ORD-2024-0128 received from ABC Corporation',
    timestamp: '10 minutes ago',
  },
  {
    id: '2',
    type: 'complete',
    message: 'Order #ORD-2024-0125 marked as delivered',
    timestamp: '1 hour ago',
    user: 'Maria Santos',
  },
  {
    id: '3',
    type: 'alert',
    message: 'Low stock alert: Glossy Paper A4 (5 reams remaining)',
    timestamp: '2 hours ago',
  },
  {
    id: '4',
    type: 'inventory',
    message: 'Added 50 packs of Business Card Stock',
    timestamp: '3 hours ago',
    user: 'Juan Dela Cruz',
  },
  {
    id: '5',
    type: 'edit',
    message: 'Updated pricing for Premium Tarpaulin',
    timestamp: '5 hours ago',
    user: 'Admin User',
  },
  {
    id: '6',
    type: 'user',
    message: 'New staff member added: Pedro Reyes',
    timestamp: 'Yesterday',
    user: 'Admin User',
  },
];

const activityIcons = {
  order: ShoppingCart,
  inventory: Package,
  user: UserPlus,
  alert: AlertTriangle,
  complete: CheckCircle,
  edit: Edit,
};

const activityColors = {
  order: 'text-info bg-info/10',
  inventory: 'text-primary bg-primary/10',
  user: 'text-accent bg-accent/10',
  alert: 'text-warning bg-warning/10',
  complete: 'text-success bg-success/10',
  edit: 'text-muted-foreground bg-muted',
};

export function ActivityFeed() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-display font-semibold text-foreground">
          Recent Activity
        </h3>
        <a
          href="/activity"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </a>
      </div>
      <div className="p-6">
        <div className="relative space-y-6">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <div key={activity.id} className="relative flex gap-4 pl-10">
                <div
                  className={cn(
                    'absolute left-0 flex h-8 w-8 items-center justify-center rounded-full',
                    colorClass
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </span>
                    {activity.user && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          by {activity.user}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
