import { useState } from 'react';
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/security';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for reports
const revenueData = [
  { month: 'Sep', revenue: 285000 },
  { month: 'Oct', revenue: 312000 },
  { month: 'Nov', revenue: 298000 },
  { month: 'Dec', revenue: 425000 },
  { month: 'Jan', revenue: 378000 },
  { month: 'Feb', revenue: 395000 },
];

const orderTrendsData = [
  { month: 'Sep', orders: 45, completed: 42 },
  { month: 'Oct', orders: 52, completed: 48 },
  { month: 'Nov', orders: 48, completed: 45 },
  { month: 'Dec', orders: 68, completed: 62 },
  { month: 'Jan', orders: 55, completed: 51 },
  { month: 'Feb', orders: 58, completed: 54 },
];

const categoryData = [
  { name: 'Business Cards', value: 28, color: 'hsl(220, 60%, 20%)' },
  { name: 'Banners & Tarpaulins', value: 22, color: 'hsl(35, 90%, 55%)' },
  { name: 'Flyers & Brochures', value: 18, color: 'hsl(142, 70%, 40%)' },
  { name: 'Stickers & Labels', value: 15, color: 'hsl(200, 80%, 50%)' },
  { name: 'Invitations', value: 10, color: 'hsl(280, 60%, 50%)' },
  { name: 'Others', value: 7, color: 'hsl(0, 0%, 60%)' },
];

const inventoryTurnoverData = [
  { category: 'Paper', turnover: 4.2 },
  { category: 'Ink', turnover: 3.8 },
  { category: 'Substrate', turnover: 2.9 },
  { category: 'Finishing', turnover: 2.1 },
  { category: 'Packaging', turnover: 3.5 },
];

export default function Reports() {
  const [period, setPeriod] = useState('6months');

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(2093000),
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: 'Total Orders',
      value: '326',
      change: '+8.2%',
      isPositive: true,
      icon: ShoppingCart,
    },
    {
      title: 'Avg. Order Value',
      value: formatCurrency(6420),
      change: '+4.1%',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: 'Inventory Turnover',
      value: '3.3x',
      change: '-0.2',
      isPositive: false,
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-muted-foreground">
            Analyze your business performance and trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center justify-between">
                  <span>{card.title}</span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-display">
                  {card.value}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {card.isPositive ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      card.isPositive ? 'text-success' : 'text-destructive'
                    )}
                  >
                    {card.change}
                  </span>
                  <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Overview
            </CardTitle>
            <CardDescription>Monthly revenue for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis
                    className="text-xs"
                    tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order trends */}
        <Card>
          <CardHeader>
            <CardTitle>Order Trends</CardTitle>
            <CardDescription>Orders received vs completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={orderTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                    name="Orders"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--success))' }}
                    name="Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Category</CardTitle>
            <CardDescription>Distribution of order types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, 'Share']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {categoryData.map((category) => (
                  <div key={category.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm flex-1">{category.name}</span>
                    <span className="text-sm font-medium">{category.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory turnover */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Turnover by Category</CardTitle>
            <CardDescription>How fast inventory sells (times per period)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryTurnoverData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="category" type="category" className="text-xs" width={80} />
                  <Tooltip
                    formatter={(value: number) => [`${value}x`, 'Turnover']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="turnover"
                    fill="hsl(var(--accent))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
