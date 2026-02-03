import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  amount: string;
  status: 'pending' | 'in_progress' | 'ready' | 'delivered';
  date: string;
}

const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-0128',
    customer: 'ABC Corporation',
    amount: '₱12,500.00',
    status: 'in_progress',
    date: 'Today, 10:30 AM',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-0127',
    customer: 'Maria Santos',
    amount: '₱3,200.00',
    status: 'ready',
    date: 'Today, 9:15 AM',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-0126',
    customer: 'Tech Solutions Inc.',
    amount: '₱45,000.00',
    status: 'pending',
    date: 'Yesterday, 4:45 PM',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-0125',
    customer: 'Juan Dela Cruz',
    amount: '₱850.00',
    status: 'delivered',
    date: 'Yesterday, 2:30 PM',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-0124',
    customer: 'PH Marketing Co.',
    amount: '₱28,750.00',
    status: 'delivered',
    date: 'Feb 1, 2024',
  },
];

const statusStyles = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  in_progress: 'bg-info/10 text-info border-info/20',
  ready: 'bg-success/10 text-success border-success/20',
  delivered: 'bg-muted text-muted-foreground border-border',
};

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  ready: 'Ready',
  delivered: 'Delivered',
};

export function RecentOrders() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-display font-semibold text-foreground">
          Recent Orders
        </h3>
        <a
          href="/orders"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </a>
      </div>
      <div className="divide-y divide-border">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <p className="font-medium text-foreground">
                  {order.orderNumber}
                </p>
                <Badge
                  variant="outline"
                  className={cn('text-xs', statusStyles[order.status])}
                >
                  {statusLabels[order.status]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {order.customer}
              </p>
            </div>
            <div className="text-right ml-4">
              <p className="font-medium text-foreground">{order.amount}</p>
              <p className="text-xs text-muted-foreground">{order.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
