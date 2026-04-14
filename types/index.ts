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
  phone: string;
  company?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
  isActive: boolean;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  client?: Client;
  status: string;
  priority: string;
  budgetAmount?: number;
  startDate?: string;
  expectedEndDate?: string;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  trade: string;
  status: string;
  hourlyRate?: number;
  overtimeRate?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  project?: Project;
  title: string;
  description?: string;
  status: string;
  priority: string;
  progress: number;
  startDate?: string;
  dueDate?: string;
  assignedToId?: string;
  assignedTo?: Worker;
  createdAt: string;
  updatedAt: string;
}

export interface WorkerLog {
  id: string;
  workerId: string;
  worker?: Worker;
  projectId: string;
  project?: Project;
  clientId: string;
  client?: Client;
  taskId?: string;
  task?: Task;
  logDate: string;
  hoursWorked: number;
  overtimeHours?: number;
  logType: string;
  status: string;
  hourlyRateSnapshot?: number;
  totalCost?: number;
  description?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  clientId: string;
  client?: Client;
  projectId: string;
  project?: Project;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  subtotal: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  items?: InvoiceItem[];
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: string;
  reference?: string;
  notes?: string;
  createdAt: string;
}
