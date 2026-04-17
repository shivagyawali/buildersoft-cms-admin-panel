export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "superadmin" | "admin" | "manager" | "supervisor" | "worker" | "contractor";
  phone?: string;
  company?: string;
  companyId?: string;
  companyRef?: Company;
  isActive?: boolean;
  createdAt?: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  description?: string;
  logo?: string;
  status: "active" | "inactive" | "trial" | "suspended";
  plan: "free" | "starter" | "pro" | "enterprise";
  maxUsers: number;
  maxProjects: number;
  maxWorkers: number;
  ownerId?: string;
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  createdAt: string;
  updatedAt?: string;
  stats?: {
    users: number;
    projects: number;
    workers: number;
    clients: number;
    totalBilled: number;
    totalPaid: number;
  };
}

export interface Client {
  id: string;
  companyId?: string;
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
  isActive?: boolean;
  createdAt: string;
}

export interface Worker {
  id: string;
  companyId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  hourlyRate?: number;
  overtimeRate?: number;
  status: "active" | "inactive" | "on_leave";
  createdAt: string;
}

export interface Project {
  id: string;
  companyId?: string;
  name: string;
  description?: string;
  clientId: string;
  client?: Client;
  budgetAmount?: number;
  spentAmount?: number;
  startDate?: string;
  expectedEndDate?: string;
  priority: string;
  status: string;
  progress?: number;
  location?: string;
  type?: string;
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
  companyId?: string;
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
  amountPaid?: number;
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
  companyId?: string;
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

export interface RolePermission {
  id: string;
  companyId?: string;
  role: string;
  allowedRoutes: string[];
  customPermissions?: Record<string, boolean>;
  description?: string;
}

export interface DashboardData {
  clients:        { total: number; active: number };
  projects:       { total: number; active: number; planning: number; completed: number; on_hold: number; cancelled: number };
  invoices:       { total: number; paid: number; pending: number; totalRevenue: number; outstanding: number; overdue: number };
  workers:        { total: number; active: number; inactive: number; on_leave: number };
  tasks:          { total: number; todo: number; in_progress: number; review: number; done: number; cancelled: number; avgProgress: number };
  recentProjects: any[];
  recentInvoices: any[];
  monthlyRevenue: { month: string; revenue: number; billed: number; invoiceCount: number }[];
}

export interface SuperAdminDashboard {
  companies: {
    total: number; active: number; trial: number; suspended: number;
    byPlan: { free: number; starter: number; pro: number; enterprise: number };
  };
  users:     { total: number; active: number; admins: number; managers: number; supervisors: number; workers: number };
  projects:  { total: number; active: number; completed: number; planning: number; on_hold: number };
  invoices:  { total: number; totalBilled: number; totalPaid: number; outstanding: number; overdue: number };
  workers:   { total: number; active: number };
  recentCompanies: any[];
  topCompanies:    any[];
  monthlyGrowth:   { month: string; newCompanies: number }[];
}
