import { useState } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  Users as UsersIcon,
  Shield,
  ShieldCheck,
  User as UserIcon,
  Edit,
  Trash2,
  Key,
  Ban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { User } from '@/types/inventory';
import { sanitizeHtml } from '@/lib/security';
import { cn } from '@/lib/utils';

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@printflow.ph',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-02-03T08:30:00'),
  },
  {
    id: '2',
    email: 'manager@printflow.ph',
    name: 'Maria Santos',
    role: 'manager',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-02-03T09:15:00'),
  },
  {
    id: '3',
    email: 'staff@printflow.ph',
    name: 'Juan Dela Cruz',
    role: 'staff',
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date('2024-02-02T16:45:00'),
  },
  {
    id: '4',
    email: 'pedro.reyes@printflow.ph',
    name: 'Pedro Reyes',
    role: 'staff',
    createdAt: new Date('2024-02-02'),
    lastLogin: new Date('2024-02-03T07:00:00'),
  },
  {
    id: '5',
    email: 'ana.garcia@printflow.ph',
    name: 'Ana Garcia',
    role: 'manager',
    createdAt: new Date('2024-01-20'),
    lastLogin: new Date('2024-02-01T14:30:00'),
  },
];

const roleConfig = {
  admin: {
    label: 'Admin',
    color: 'bg-destructive/10 text-destructive border-destructive/20',
    icon: ShieldCheck,
  },
  manager: {
    label: 'Manager',
    color: 'bg-primary/10 text-primary border-primary/20',
    icon: Shield,
  },
  staff: {
    label: 'Staff',
    color: 'bg-muted text-muted-foreground border-border',
    icon: UserIcon,
  },
};

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = mockUsers.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatLastLogin = (date?: Date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return formatDate(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-muted-foreground">
            Manage user accounts and access permissions
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
        <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-foreground">Role-Based Access Control</p>
          <p className="text-muted-foreground">
            Users are assigned roles that determine their access level. Admins have full access,
            managers can view reports and manage inventory, and staff can only manage orders.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="font-semibold">Last Login</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <UsersIcon className="h-8 w-8 mb-2" />
                    <p>No users found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const role = roleConfig[user.role];
                const RoleIcon = role.icon;

                return (
                  <TableRow key={user.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {sanitizeHtml(user.name)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {sanitizeHtml(user.email)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-xs gap-1', role.color)}
                      >
                        <RoleIcon className="h-3 w-3" />
                        {role.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatLastLogin(user.lastLogin)}
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
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Key className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
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
          Showing {filteredUsers.length} of {mockUsers.length} users
        </p>
        <div className="flex items-center gap-4">
          <span>
            Admins: {mockUsers.filter((u) => u.role === 'admin').length}
          </span>
          <span>
            Managers: {mockUsers.filter((u) => u.role === 'manager').length}
          </span>
          <span>
            Staff: {mockUsers.filter((u) => u.role === 'staff').length}
          </span>
        </div>
      </div>
    </div>
  );
}
