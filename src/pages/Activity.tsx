import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Shield,
  LogIn,
  LogOut,
  Edit,
  Plus,
  Trash2,
  Eye,
  AlertTriangle,
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
import { sanitizeHtml, maskSensitiveData } from '@/lib/security';
import { cn } from '@/lib/utils';

interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view' | 'failed_login';
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
}

// Mock activity log data
const mockActivityLog: ActivityLogEntry[] = [
  {
    id: '1',
    timestamp: new Date('2024-02-03T10:30:00'),
    userId: '1',
    userName: 'Admin User',
    action: 'login',
    resource: 'Authentication',
    details: 'User logged in successfully',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/120.0.0.0',
  },
  {
    id: '2',
    timestamp: new Date('2024-02-03T10:25:00'),
    userId: '2',
    userName: 'Maria Santos',
    action: 'create',
    resource: 'Orders',
    details: 'Created order #ORD-2024-0128',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox/121.0',
  },
  {
    id: '3',
    timestamp: new Date('2024-02-03T10:20:00'),
    userId: '3',
    userName: 'Juan Dela Cruz',
    action: 'update',
    resource: 'Inventory',
    details: 'Updated stock quantity for PAP-GLO-A4-250',
    ipAddress: '192.168.1.102',
    userAgent: 'Safari/17.0',
  },
  {
    id: '4',
    timestamp: new Date('2024-02-03T10:15:00'),
    userId: '',
    userName: 'Unknown',
    action: 'failed_login',
    resource: 'Authentication',
    details: 'Failed login attempt for admin@printflow.ph',
    ipAddress: '203.177.45.12',
    userAgent: 'Unknown',
  },
  {
    id: '5',
    timestamp: new Date('2024-02-03T09:45:00'),
    userId: '1',
    userName: 'Admin User',
    action: 'delete',
    resource: 'Inventory',
    details: 'Deleted item SKU: OLD-ITEM-001',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/120.0.0.0',
  },
  {
    id: '6',
    timestamp: new Date('2024-02-03T09:30:00'),
    userId: '2',
    userName: 'Maria Santos',
    action: 'view',
    resource: 'Reports',
    details: 'Viewed monthly revenue report',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox/121.0',
  },
  {
    id: '7',
    timestamp: new Date('2024-02-03T09:00:00'),
    userId: '2',
    userName: 'Maria Santos',
    action: 'login',
    resource: 'Authentication',
    details: 'User logged in successfully',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox/121.0',
  },
  {
    id: '8',
    timestamp: new Date('2024-02-02T18:00:00'),
    userId: '3',
    userName: 'Juan Dela Cruz',
    action: 'logout',
    resource: 'Authentication',
    details: 'User logged out',
    ipAddress: '192.168.1.102',
    userAgent: 'Safari/17.0',
  },
];

const actionConfig = {
  login: { label: 'Login', color: 'bg-success/10 text-success border-success/20', icon: LogIn },
  logout: { label: 'Logout', color: 'bg-muted text-muted-foreground border-border', icon: LogOut },
  create: { label: 'Create', color: 'bg-info/10 text-info border-info/20', icon: Plus },
  update: { label: 'Update', color: 'bg-warning/10 text-warning border-warning/20', icon: Edit },
  delete: { label: 'Delete', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: Trash2 },
  view: { label: 'View', color: 'bg-primary/10 text-primary border-primary/20', icon: Eye },
  failed_login: { label: 'Failed Login', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertTriangle },
};

export default function Activity() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filteredLogs = mockActivityLog.filter((log) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        log.userName.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query) ||
        log.resource.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    if (actionFilter !== 'all' && log.action !== actionFilter) {
      return false;
    }

    return true;
  });

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-PH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-muted-foreground">
            Monitor user actions and system events for security auditing
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
        <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-foreground">Security Audit Log</p>
          <p className="text-muted-foreground">
            All user actions are logged for security and compliance purposes. 
            IP addresses are partially masked for privacy. Logs are retained for 90 days.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by user, action, or resource..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {Object.entries(actionConfig).map(([key, config]) => (
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
              <TableHead className="font-semibold">Timestamp</TableHead>
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">Resource</TableHead>
              <TableHead className="font-semibold">Details</TableHead>
              <TableHead className="font-semibold">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Shield className="h-8 w-8 mb-2" />
                    <p>No activity logs found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => {
                const action = actionConfig[log.action];
                const ActionIcon = action.icon;
                const isSecurityEvent = ['failed_login', 'delete'].includes(log.action);

                return (
                  <TableRow
                    key={log.id}
                    className={cn(isSecurityEvent && 'bg-destructive/5')}
                  >
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {sanitizeHtml(log.userName)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-xs gap-1', action.color)}
                      >
                        <ActionIcon className="h-3 w-3" />
                        {action.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sanitizeHtml(log.resource)}
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <span className="text-sm text-foreground truncate block">
                        {sanitizeHtml(log.details)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {maskSensitiveData(log.ipAddress, 6)}
                      </code>
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
          Showing {filteredLogs.length} of {mockActivityLog.length} log entries
        </p>
        <p className="text-xs">
          Failed login attempts:{' '}
          <span className="font-medium text-destructive">
            {mockActivityLog.filter((l) => l.action === 'failed_login').length}
          </span>
        </p>
      </div>
    </div>
  );
}
