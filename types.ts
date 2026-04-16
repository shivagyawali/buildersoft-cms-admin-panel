export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  company?: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
  createdAt: string;
}

export interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  hourlyRate?: number;
  overtimeRate?: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  client?: Client;
  budgetAmount?: number;
  startDate?: string;
  expectedEndDate?: string;
  priority: string;
  status: string;
  progress?: number;
  workers?: Worker[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  project?: Project;
  priority: string;
  status: string;
  progress: number;
  startDate?: string;
  dueDate?: string;
  assignedWorkers?: Worker[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client?: Client;
  projectId?: string;
  project?: Project;
  issueDate: string;
  dueDate: string;
  status: string;
  subtotal?: number;
  taxAmount?: number;
  totalAmount: number;
  amountDue?: number;
  notes?: string;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total?: number;
}

export interface InvoicePeriod {
  id: string;
  workerId: string;
  worker?: Worker;
  startDate: string;
  endDate: string;
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  overtimeRate: number;
  totalPay: number;
  notes?: string;
  createdAt: string;
}
