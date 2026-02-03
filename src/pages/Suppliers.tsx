import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  Truck,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Supplier } from '@/types/inventory';
import { sanitizeHtml } from '@/lib/security';
import { searchQuerySchema } from '@/lib/validation';

// Mock suppliers data
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'PH Paper Co.',
    contactPerson: 'Ricardo Mendoza',
    email: 'sales@phpaper.com.ph',
    phone: '+63 2 8123 4567',
    address: '123 Industrial Ave, Makati City, Metro Manila',
    notes: 'Reliable paper supplier. Offers bulk discounts.',
  },
  {
    id: '2',
    name: 'PrintTech Supply',
    contactPerson: 'Anna Reyes',
    email: 'orders@printtech.ph',
    phone: '+63 2 8234 5678',
    address: '456 Commerce St, Pasig City, Metro Manila',
    notes: 'Main ink and equipment supplier.',
  },
  {
    id: '3',
    name: 'Tarp Masters PH',
    contactPerson: 'Jose Garcia',
    email: 'info@tarpmasters.com',
    phone: '+63 917 345 6789',
    address: '789 Manufacturing Road, Quezon City, Metro Manila',
  },
  {
    id: '4',
    name: 'Lam Supplies',
    contactPerson: 'Michelle Tan',
    email: 'michelle@lamsupplies.ph',
    phone: '+63 918 456 7890',
    address: '321 Business Park, Taguig City, Metro Manila',
    notes: 'Laminating and finishing materials.',
  },
  {
    id: '5',
    name: 'Sticker World',
    contactPerson: 'Patrick Lee',
    email: 'patrick@stickerworld.ph',
    phone: '+63 919 567 8901',
    address: '654 Industrial Zone, Caloocan City, Metro Manila',
  },
  {
    id: '6',
    name: 'Box Factory PH',
    contactPerson: 'Grace Santos',
    email: 'orders@boxfactory.ph',
    phone: '+63 920 678 9012',
    address: '987 Packaging Lane, Valenzuela City, Metro Manila',
    notes: 'Custom packaging solutions. Minimum order: 100 pcs.',
  },
];

export default function Suppliers() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sanitize search input
  const handleSearch = (value: string) => {
    const result = searchQuerySchema.safeParse(value);
    if (result.success) {
      setSearchQuery(result.data);
    }
  };

  // Filter suppliers
  const filteredSuppliers = useMemo(() => {
    if (!searchQuery) return mockSuppliers;

    const query = searchQuery.toLowerCase();
    return mockSuppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(query) ||
        supplier.contactPerson.toLowerCase().includes(query) ||
        supplier.email.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-muted-foreground">
            Manage your material suppliers and vendors
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search suppliers..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Suppliers grid */}
      {filteredSuppliers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Truck className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">No suppliers found</p>
          <p className="text-sm">Try adjusting your search query</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {sanitizeHtml(supplier.name)}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {sanitizeHtml(supplier.contactPerson)}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
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
                        Edit Supplier
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Supplier
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a
                    href={`mailto:${supplier.email}`}
                    className="hover:text-primary truncate"
                  >
                    {sanitizeHtml(supplier.email)}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{sanitizeHtml(supplier.phone)}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{sanitizeHtml(supplier.address)}</span>
                </div>
                {supplier.notes && (
                  <p className="text-xs text-muted-foreground bg-muted rounded-md p-2 mt-2">
                    {sanitizeHtml(supplier.notes)}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredSuppliers.length} of {mockSuppliers.length} suppliers
      </div>
    </div>
  );
}
