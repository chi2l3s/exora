// Customer Object
export interface Customer {
  id: string;
  merchantId: string;
  email: string;
  phone?: string;
  name?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Create Customer Input
export interface CreateCustomerInput {
  email: string;
  phone?: string;
  name?: string;
  metadata?: Record<string, unknown>;
}

// Update Customer Input
export interface UpdateCustomerInput {
  email?: string;
  phone?: string;
  name?: string;
  metadata?: Record<string, unknown>;
}

// Customer Filters
export interface CustomerFilters {
  email?: string;
  phone?: string;
  name?: string;
  startDate?: Date;
  endDate?: Date;
}
