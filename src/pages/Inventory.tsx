import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Package,
  Edit,
  Trash2,
  Eye,
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InventoryItem, InventoryCategory } from '@/types/inventory';
import { formatCurrency, sanitizeHtml } from '@/lib/security';
import { searchQuerySchema } from '@/lib/validation';
import { cn } from '@/lib/utils';

// Mock inventory data
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Glossy Paper A4 (250gsm)',
    sku: 'PAP-GLO-A4-250',
    category: 'paper',
    quantity: 5,
    minStock: 20,
    unit: 'reams',
    unitPrice: 450,
    supplier: 'PH Paper Co.',
    location: 'Shelf A1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '2',
    name: 'Cyan Ink Cartridge (Large)',
    sku: 'INK-CYN-001',
    category: 'ink',
    quantity: 2,
    minStock: 10,
    unit: 'pcs',
    unitPrice: 2500,
    supplier: 'PrintTech Supply',
    location: 'Cabinet B2',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    name: 'Premium Tarpaulin Roll (13oz)',
    sku: 'SUB-TARP-13',
    category: 'substrate',
    quantity: 15,
    minStock: 10,
    unit: 'rolls',
    unitPrice: 3500,
    supplier: 'Tarp Masters PH',
    location: 'Warehouse 1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-30'),
  },
  {
    id: '4',
    name: 'Laminating Film Roll (100m)',
    sku: 'FIN-LAM-ROLL',
    category: 'finishing',
    quantity: 3,
    minStock: 15,
    unit: 'rolls',
    unitPrice: 1800,
    supplier: 'Lam Supplies',
    location: 'Shelf C3',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '5',
    name: 'Business Card Stock (350gsm)',
    sku: 'PAP-BIZ-350',
    category: 'paper',
    quantity: 8,
    minStock: 30,
    unit: 'packs',
    unitPrice: 280,
    supplier: 'PH Paper Co.',
    location: 'Shelf A2',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-28'),
  },
  {
    id: '6',
    name: 'Magenta Ink Cartridge (Large)',
    sku: 'INK-MAG-001',
    category: 'ink',
    quantity: 8,
    minStock: 10,
    unit: 'pcs',
    unitPrice: 2500,
    supplier: 'PrintTech Supply',
    location: 'Cabinet B2',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-29'),
  },
  {
    id: '7',
    name: 'Vinyl Sticker Roll (White)',
    sku: 'SUB-VIN-WHT',
    category: 'substrate',
    quantity: 25,
    minStock: 15,
    unit: 'rolls',
    unitPrice: 1200,
    supplier: 'Sticker World',
    location: 'Warehouse 1',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '8',
    name: 'Corrugated Box (Medium)',
    sku: 'PKG-BOX-MED',
    category: 'packaging',
    quantity: 100,
    minStock: 50,
    unit: 'pcs',
    unitPrice: 35,
    supplier: 'Box Factory PH',
    location: 'Warehouse 2',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-02-01'),
  },
];

const categoryLabels: Record<InventoryCategory, string> = {
  paper: 'Paper',
  ink: 'Ink',
  substrate: 'Substrate',
  equipment: 'Equipment',
  finishing: 'Finishing',
  packaging: 'Packaging',
  other: 'Other',
};

const categoryColors: Record<InventoryCategory, string> = {
  paper: 'bg-info/10 text-info border-info/20',
  ink: 'bg-primary/10 text-primary border-primary/20',
  substrate: 'bg-accent/10 text-accent-foreground border-accent/20',
  equipment: 'bg-muted text-muted-foreground border-border',
  finishing: 'bg-success/10 text-success border-success/20',
  packaging: 'bg-warning/10 text-warning border-warning/20',
  other: 'bg-secondary text-secondary-foreground border-border',
};

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');

  // Sanitize search input
  const handleSearch = (value: string) => {
    const result = searchQuerySchema.safeParse(value);
    if (result.success) {
      setSearchQuery(result.data);
    }
  };

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return mockInventory.filter((item) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          (item.supplier && item.supplier.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      // Stock filter
      if (stockFilter === 'low' && item.quantity >= item.minStock) {
        return false;
      }
      if (stockFilter === 'in-stock' && item.quantity < item.minStock) {
        return false;
      }

      return true;
    });
  }, [searchQuery, categoryFilter, stockFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-muted-foreground">
            Manage your printing materials, inks, and supplies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, SKU, or supplier..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Stock Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock Levels</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Item</TableHead>
              <TableHead className="font-semibold">SKU</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold text-right">Quantity</TableHead>
              <TableHead className="font-semibold text-right">Unit Price</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Package className="h-8 w-8 mb-2" />
                    <p>No items found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory.map((item) => {
                const isLowStock = item.quantity < item.minStock;
                const stockPercentage = (item.quantity / item.minStock) * 100;

                return (
                  <TableRow key={item.id} className="group">
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {sanitizeHtml(item.name)}
                      </div>
                      {item.supplier && (
                        <div className="text-xs text-muted-foreground">
                          {sanitizeHtml(item.supplier)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {sanitizeHtml(item.sku)}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-xs', categoryColors[item.category])}
                      >
                        {categoryLabels[item.category]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={cn(
                            'font-medium',
                            isLowStock ? 'text-destructive' : 'text-foreground'
                          )}
                        >
                          {item.quantity}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {item.unit}
                        </span>
                        {isLowStock && (
                          <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                            Low
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.location ? sanitizeHtml(item.location) : '—'}
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
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Item
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
          Showing {filteredInventory.length} of {mockInventory.length} items
        </p>
        <p>
          Total value:{' '}
          <span className="font-medium text-foreground">
            {formatCurrency(
              filteredInventory.reduce(
                (acc, item) => acc + item.quantity * item.unitPrice,
                0
              )
            )}
          </span>
        </p>
      </div>
    </div>
  );
}
