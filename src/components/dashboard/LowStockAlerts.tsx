import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  unit: string;
}

const lowStockItems: LowStockItem[] = [
  {
    id: '1',
    name: 'Glossy Paper A4 (250gsm)',
    sku: 'PAP-GLO-A4-250',
    currentStock: 5,
    minStock: 20,
    unit: 'reams',
  },
  {
    id: '2',
    name: 'Cyan Ink Cartridge',
    sku: 'INK-CYN-001',
    currentStock: 2,
    minStock: 10,
    unit: 'pcs',
  },
  {
    id: '3',
    name: 'Laminating Film Roll',
    sku: 'FIN-LAM-ROLL',
    currentStock: 3,
    minStock: 15,
    unit: 'rolls',
  },
  {
    id: '4',
    name: 'Business Card Stock',
    sku: 'PAP-BIZ-350',
    currentStock: 8,
    minStock: 30,
    unit: 'packs',
  },
];

export function LowStockAlerts() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h3 className="text-lg font-display font-semibold text-foreground">
            Low Stock Alerts
          </h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {lowStockItems.length} items
        </span>
      </div>
      <div className="divide-y divide-border">
        {lowStockItems.map((item) => {
          const stockPercentage = (item.currentStock / item.minStock) * 100;
          const isVeryLow = stockPercentage <= 25;

          return (
            <div key={item.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.sku}</p>
                </div>
                <Button variant="outline" size="sm">
                  Reorder
                </Button>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className={isVeryLow ? 'text-destructive font-medium' : 'text-warning font-medium'}>
                    {item.currentStock} {item.unit}
                  </span>
                  <span className="text-muted-foreground">
                    Min: {item.minStock} {item.unit}
                  </span>
                </div>
                <Progress
                  value={stockPercentage}
                  className={isVeryLow ? '[&>div]:bg-destructive' : '[&>div]:bg-warning'}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
