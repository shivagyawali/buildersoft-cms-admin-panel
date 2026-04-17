import axios from "axios";
import Cookies from "js-cookie";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: `${BASE}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken && !error.config._retry) {
        error.config._retry = true;
        try {
          const res = await axios.post(`${BASE}/api/auth/refresh`, { refreshToken });
          const { accessToken } = res.data.data ?? res.data;
          Cookies.set("accessToken", accessToken, { expires: 7 });
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api.request(error.config);
        } catch {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          window.location.href = "/auth/login";
        }
      } else {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

/* ── Auth ──────────────────────────────────────────────────────────────────── */
export const authApi = {
  register: (d: { firstName: string; lastName: string; email: string; password: string; role?: string; companyId?: string }) =>
    api.post("/auth/register", d),
  login:         (d: { email: string; password: string }) => api.post("/auth/login", d),
  getProfile:    ()  => api.get("/auth/profile"),
  updateProfile: (d: { phone?: string; company?: string; firstName?: string; lastName?: string }) =>
    api.patch("/auth/profile", d),
  changePassword: (d: { oldPassword: string; newPassword: string }) =>
    api.post("/auth/change-password", d),
  logout: () => api.post("/auth/logout"),
};

/* ── Companies ─────────────────────────────────────────────────────────────── */
export const companiesApi = {
  list:   (p?: { status?: string; plan?: string; search?: string; limit?: number; offset?: number }) =>
    api.get("/companies", { params: p }),
  get:    (id: string) => api.get(`/companies/${id}`),
  create: (d: object)  => api.post("/companies", d),
  update: (id: string, d: object) => api.patch(`/companies/${id}`, d),
  delete: (id: string) => api.delete(`/companies/${id}`),
  toggleStatus: (id: string) => api.post(`/companies/${id}/toggle-status`),
  listUsers:    (id: string, p?: object) => api.get(`/companies/${id}/users`, { params: p }),
  createUser:   (id: string, d: object) => api.post(`/companies/${id}/users`, d),
  getRolePerms: (id: string) => api.get(`/companies/${id}/role-permissions`),
  updateRolePerms: (id: string, d: object) => api.put(`/companies/${id}/role-permissions`, d),
};

/* ── SuperAdmin ────────────────────────────────────────────────────────────── */
export const superadminApi = {
  overview:        () => api.get("/superadmin/overview"),
  listUsers:       (p?: object) => api.get("/superadmin/users", { params: p }),
  createSuperadmin:(d: object)  => api.post("/superadmin/users", d),
  updateUser:      (id: string, d: object) => api.patch(`/superadmin/users/${id}`, d),
  resetPassword:   (id: string, d: object) => api.post(`/superadmin/users/${id}/reset-password`, d),
  companyReport:   (p?: object) => api.get("/superadmin/report/company", { params: p }),
};

/* ── Clients ───────────────────────────────────────────────────────────────── */
export const clientsApi = {
  list:     (p?: { limit?: number; offset?: number; search?: string }) =>
    api.get("/clients", { params: p }),
  get:      (id: string) => api.get(`/clients/${id}`),
  create:   (d: object)  => api.post("/clients", d),
  update:   (id: string, d: object) => api.patch(`/clients/${id}`, d),
  delete:   (id: string) => api.delete(`/clients/${id}`),
  getStats: (id: string) => api.get(`/clients/${id}/stats`),
};

/* ── Projects ──────────────────────────────────────────────────────────────── */
export const projectsApi = {
  list:     (p?: { status?: string; limit?: number; offset?: number; search?: string }) =>
    api.get("/projects", { params: p }),
  get:      (id: string) => api.get(`/projects/${id}`),
  create:   (d: object)  => api.post("/projects", d),
  update:   (id: string, d: object) => api.patch(`/projects/${id}`, d),
  delete:   (id: string) => api.delete(`/projects/${id}`),
  getStats: (id: string) => api.get(`/projects/${id}/stats`),
  assignWorker: (id: string, workerId: string) => api.post(`/projects/${id}/workers`, { workerId }),
  removeWorker: (id: string, workerId: string) => api.delete(`/projects/${id}/workers/${workerId}`),
};

/* ── Tasks ─────────────────────────────────────────────────────────────────── */
export const tasksApi = {
  listByProject: (projectId: string, p?: { status?: string; limit?: number }) =>
    api.get(`/tasks/project/${projectId}`, { params: p }),
  get:            (id: string) => api.get(`/tasks/${id}`),
  create:         (d: object)  => api.post("/tasks", d),
  update:         (id: string, d: object) => api.patch(`/tasks/${id}`, d),
  updateProgress: (id: string, progress: number) => api.patch(`/tasks/${id}/progress`, { progress }),
  delete:         (id: string) => api.delete(`/tasks/${id}`),
};

/* ── Invoices ──────────────────────────────────────────────────────────────── */
export const invoicesApi = {
  list:     (p?: { status?: string; limit?: number; offset?: number }) =>
    api.get("/invoices", { params: p }),
  get:      (id: string) => api.get(`/invoices/${id}`),
  create:   (d: object)  => api.post("/invoices", d),
  update:   (id: string, d: object) => api.patch(`/invoices/${id}`, d),
  delete:   (id: string) => api.delete(`/invoices/${id}`),
  markSent: (id: string) => api.patch(`/invoices/${id}/send`),
  recordPayment: (id: string, d: object) => api.post(`/invoices/${id}/payments`, d),
  getPayments:   (id: string) => api.get(`/invoices/${id}/payments`),
};

/* ── Workers ───────────────────────────────────────────────────────────────── */
export const workersApi = {
  list:     (p?: { status?: string; limit?: number; search?: string }) =>
    api.get("/workers", { params: p }),
  get:      (id: string) => api.get(`/workers/${id}`),
  create:   (d: object)  => api.post("/workers", d),
  update:   (id: string, d: object) => api.patch(`/workers/${id}`, d),
  delete:   (id: string) => api.delete(`/workers/${id}`),
  getStats: (id: string, p?: object) => api.get(`/workers/${id}/stats`, { params: p }),
  getLogs:  (id: string, p?: object) => api.get(`/workers/${id}/logs`, { params: p }),
};

/* ── Invoice Periods ───────────────────────────────────────────────────────── */
export const invoicePeriodsApi = {
  list:     (p?: { workerId?: string; limit?: number; from?: string; to?: string }) =>
    api.get("/invoice-periods", { params: p }),
  get:      (id: string) => api.get(`/invoice-periods/${id}`),
  create:   (d: object)  => api.post("/invoice-periods", d),
  update:   (id: string, d: object) => api.patch(`/invoice-periods/${id}`, d),
  delete:   (id: string) => api.delete(`/invoice-periods/${id}`),
  summary:  (p?: object) => api.get("/invoice-periods/summary", { params: p }),
};

/* ── Role Permissions ──────────────────────────────────────────────────────── */
export const rolesApi = {
  list:        () => api.get("/role-permissions"),
  get:         (role: string) => api.get(`/role-permissions/${role}`),
  update:      (role: string, d: object) => api.put(`/role-permissions/${role}`, d),
  bulkUpdate:  (permissions: object) => api.put("/role-permissions/bulk", { permissions }),
  reset:       () => api.post("/role-permissions/reset"),
};

/* ── Dashboard ─────────────────────────────────────────────────────────────── */
export const dashboardApi = {
  overview: () => api.get("/dashboard/overview"),
  labor:    (p?: object) => api.get("/dashboard/labor", { params: p }),
};

/* ── Users ─────────────────────────────────────────────────────────────────── */
export const usersApi = {
  list:           (p?: object) => api.get("/users", { params: p }),
  get:            (id: string) => api.get(`/users/${id}`),
  create:         (d: object)  => api.post("/users", d),
  update:         (id: string, d: object) => api.patch(`/users/${id}`, d),
  updateRole:     (id: string, role: string) => api.patch(`/users/${id}/role`, { role }),
  toggleActive:   (id: string) => api.patch(`/users/${id}/toggle-active`),
  resetPassword:  (id: string, newPassword: string) => api.post(`/users/${id}/reset-password`, { newPassword }),
  delete:         (id: string) => api.delete(`/users/${id}`),
};
