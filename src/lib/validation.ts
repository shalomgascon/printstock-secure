import { z } from 'zod';

// Secure input validation schemas using Zod
// Following OWASP secure coding practices

// Email validation with strict regex
const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .max(255, 'Email must be less than 255 characters')
  .email('Please enter a valid email address')
  .refine(
    (email) => !/<[^>]*>/.test(email),
    'Invalid characters detected'
  );

// Password validation with security requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .refine(
    (password) => /[A-Z]/.test(password),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (password) => /[a-z]/.test(password),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (password) => /[0-9]/.test(password),
    'Password must contain at least one number'
  )
  .refine(
    (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    'Password must contain at least one special character'
  );

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(128, 'Password too long'),
});

// Registration/Create user schema
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .refine(
      (name) => /^[a-zA-Z\s\-'.]+$/.test(name),
      'Name contains invalid characters'
    ),
  role: z.enum(['admin', 'manager', 'staff']),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);

// Inventory item schema
export const inventoryItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name must be less than 200 characters'),
  sku: z
    .string()
    .trim()
    .min(1, 'SKU is required')
    .max(50, 'SKU must be less than 50 characters')
    .regex(/^[A-Z0-9\-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens'),
  category: z.enum(['paper', 'ink', 'substrate', 'equipment', 'finishing', 'packaging', 'other']),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative')
    .max(999999, 'Quantity exceeds maximum'),
  minStock: z
    .number()
    .int('Minimum stock must be a whole number')
    .min(0, 'Minimum stock cannot be negative')
    .max(999999, 'Minimum stock exceeds maximum'),
  unit: z
    .string()
    .trim()
    .min(1, 'Unit is required')
    .max(20, 'Unit must be less than 20 characters'),
  unitPrice: z
    .number()
    .min(0, 'Price cannot be negative')
    .max(9999999.99, 'Price exceeds maximum'),
  supplier: z
    .string()
    .trim()
    .max(200, 'Supplier name must be less than 200 characters')
    .optional(),
  location: z
    .string()
    .trim()
    .max(100, 'Location must be less than 100 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
});

// Order schema
export const orderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, 'Customer name must be at least 2 characters')
    .max(200, 'Customer name must be less than 200 characters'),
  customerContact: z
    .string()
    .trim()
    .min(10, 'Contact must be at least 10 characters')
    .max(100, 'Contact must be less than 100 characters'),
  dueDate: z.date().refine(
    (date) => date > new Date(),
    'Due date must be in the future'
  ),
  notes: z
    .string()
    .trim()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
});

// Order item schema
export const orderItemSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(2, 'Product name must be at least 2 characters')
    .max(200, 'Product name must be less than 200 characters'),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(99999, 'Quantity exceeds maximum'),
  unitPrice: z
    .number()
    .min(0.01, 'Price must be at least ₱0.01')
    .max(9999999.99, 'Price exceeds maximum'),
  specifications: z
    .string()
    .trim()
    .max(500, 'Specifications must be less than 500 characters')
    .optional(),
});

// Supplier schema
export const supplierSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name must be less than 200 characters'),
  contactPerson: z
    .string()
    .trim()
    .min(2, 'Contact person must be at least 2 characters')
    .max(100, 'Contact person must be less than 100 characters'),
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .min(10, 'Phone must be at least 10 characters')
    .max(20, 'Phone must be less than 20 characters')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  address: z
    .string()
    .trim()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must be less than 500 characters'),
  notes: z
    .string()
    .trim()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
});

// Search query sanitization
export const searchQuerySchema = z
  .string()
  .trim()
  .max(100, 'Search query too long')
  .transform((val) => {
    // Remove potentially dangerous characters
    return val.replace(/[<>'"`;\\]/g, '');
  });

// Export types inferred from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type OrderItemFormData = z.infer<typeof orderItemSchema>;
export type SupplierFormData = z.infer<typeof supplierSchema>;
