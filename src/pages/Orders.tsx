import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Printer,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Order, OrderStatus } from '@/types/inventory';
import { formatCurrency, sanitizeHtml } from '@/lib/security';
import { searchQuerySchema } from '@/lib/validation';
import { cn } from '@/lib/utils';

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-0128',
    customerName: 'ABC Corporation',
    customerContact: '+63 917 123 4567',
    items: [
      { id: '1', productName: 'Business Cards (500pcs)', quantity: 2, unitPrice: 1500 },
      { id: '2', productName: 'Company Letterhead', quantity: 5, unitPrice: 800 },
    ],
    status: 'in_progress',
    totalAmount: 7000,
    dueDate: new Date('2024-02-10'),
    notes: 'Rush order - needs UV coating',
    createdAt: new Date('2024-02-03'),
    updatedAt: new Date('2024-02-03'),
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-0127',
    customerName: 'Maria Santos',
    customerContact: 'maria.santos@email.com',
    items: [
      { id: '1', productName: 'Wedding Invitations (100pcs)', quantity: 1, unitPrice: 3200 },
    ],
    status: 'ready',
    totalAmount: 3200,
    dueDate: new Date('2024-02-15'),
    createdAt: new Date('2024-02-02'),
    updatedAt: new Date('2024-02-03'),
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-0126',
    customerName: 'Tech Solutions Inc.',
    customerContact: '+63 918 987 6543',
    items: [
      { id: '1', productName: 'Product Catalog (A4)', quantity: 500, unitPrice: 45 },
      { id: '2', productName: 'Flyers (A5)', quantity: 1000, unitPrice: 8 },
      { id: '3', productName: 'Pull-up Banner', quantity: 3, unitPrice: 2500 },
    ],
    status: 'pending',
    totalAmount: 37500,
    dueDate: new Date('2024-02-20'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-0125',
    customerName: 'Juan Dela Cruz',
    customerContact: '+63 919 555 1234',
    items: [
      { id: '1', productName: 'ID Cards (10pcs)', quantity: 1, unitPrice: 850 },
    ],
    status: 'delivered',
    totalAmount: 850,
    dueDate: new Date('2024-02-01'),
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-0124',
    customerName: 'PH Marketing Co.',
    customerContact: 'orders@phmarketing.com',
    items: [
      { id: '1', productName: 'Tarpaulin Banner (8x4ft)', quantity: 5, unitPrice: 1200 },
      { id: '2', productName: 'Sticker Labels', quantity: 2000, unitPrice: 5 },
    ],
    status: 'delivered',
    totalAmount: 16000,
    dueDate: new Date('2024-01-28'),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-28'),
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-0123',
    customerName: 'Sample Client',
    customerContact: '+63 920 111 2222',
    items: [
      { id: '1', productName: 'Brochures (Trifold)', quantity: 200, unitPrice: 25 },
    ],
    status: 'cancelled',
    totalAmount: 5000,
    dueDate: new Date('2024-01-25'),
    notes: 'Cancelled by customer',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
  },
];

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning border-warning/20', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-info/10 text-info border-info/20', icon: Printer },
  printing: { label: 'Printing', color: 'bg-primary/10 text-primary border-primary/20', icon: Printer },
  finishing: { label: 'Finishing', color: 'bg-accent/10 text-accent-foreground border-accent/20', icon: Package },
  ready: { label: 'Ready', color: 'bg-success/10 text-success border-success/20', icon: CheckCircle },
  delivered: { label: 'Delivered', color: 'bg-muted text-muted-foreground border-border', icon: Truck },
  cancelled: { label: 'Cancelled', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle },
};

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Sanitize search input
  const handleSearch = (value: string) => {
    const result = searchQuerySchema.safeParse(value);
    if (result.success) {
      setSearchQuery(result.data);
    }
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerContact.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const isOverdue = (dueDate: Date, status: OrderStatus) => {
    return new Date() > dueDate && !['delivered', 'cancelled'].includes(status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-muted-foreground">
            Track and manage customer print orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by order number, customer name, or contact..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(statusConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Order</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Items</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Amount</TableHead>
              <TableHead className="font-semibold">Due Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <ShoppingCart className="h-8 w-8 mb-2" />
                    <p>No orders found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                const overdue = isOverdue(order.dueDate, order.status);

                return (
                  <TableRow key={order.id} className="group">
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {sanitizeHtml(order.orderNumber)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {sanitizeHtml(order.customerName)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {sanitizeHtml(order.customerContact)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {order.items.map(i => i.productName).join(', ')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-xs gap-1', status.color)}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        'text-sm',
                        overdue && 'text-destructive font-medium'
                      )}>
                        {formatDate(order.dueDate)}
                      </div>
                      {overdue && (
                        <div className="text-xs text-destructive">Overdue</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Order
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Ready
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Truck className="h-4 w-4 mr-2" />
                            Mark as Delivered
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {filteredOrders.length} of {mockOrders.length} orders
        </p>
        <p>
          Total value:{' '}
          <span className="font-medium text-foreground">
            {formatCurrency(
              filteredOrders.reduce((acc, order) => acc + order.totalAmount, 0)
            )}
          </span>
        </p>
      </div>
    </div>
  );
}
