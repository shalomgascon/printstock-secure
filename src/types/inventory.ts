// Type definitions for PrintFlow Inventory System
// Following TypeScript strict mode for type safety

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  createdAt: Date;
  lastLogin?: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: InventoryCategory;
  quantity: number;
  minStock: number;
  unit: string;
  unitPrice: number;
  supplier?: string;
  location?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InventoryCategory = 
  | 'paper'
  | 'ink'
  | 'substrate'
  | 'equipment'
  | 'finishing'
  | 'packaging'
  | 'other';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerContact: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  dueDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  specifications?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'in_progress'
  | 'printing'
  | 'finishing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: Date;
}

// Dashboard statistics
export interface DashboardStats {
  totalInventoryItems: number;
  lowStockItems: number;
  pendingOrders: number;
  completedOrdersToday: number;
  totalInventoryValue: number;
  recentActivities: ActivityLog[];
}

// Form validation schemas will use zod
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
