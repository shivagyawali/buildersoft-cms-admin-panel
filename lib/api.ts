import axios from "axios";
import Cookies from "js-cookie";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (d: { firstName: string; lastName: string; email: string; password: string; role: string }) =>
    api.post("/auth/register", d),
  login: (d: { email: string; password: string }) => api.post("/auth/login", d),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (d: { phone?: string; company?: string }) => api.patch("/auth/profile", d),
  changePassword: (d: { oldPassword: string; newPassword: string }) => api.post("/auth/change-password", d),
};

export const clientsApi = {
  list: (p?: { limit?: number; offset?: number }) => api.get("/clients", { params: p }),
  get: (id: string) => api.get(`/clients/${id}`),
  create: (d: object) => api.post("/clients", d),
  update: (id: string, d: object) => api.patch(`/clients/${id}`, d),
  delete: (id: string) => api.delete(`/clients/${id}`),
  getStats: (id: string) => api.get(`/clients/${id}/stats`),
};

export const projectsApi = {
  list: (p?: { status?: string; limit?: number; offset?: number }) => api.get("/projects", { params: p }),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (d: object) => api.post("/projects", d),
  update: (id: string, d: object) => api.patch(`/projects/${id}`, d),
  delete: (id: string) => api.delete(`/projects/${id}`),
  getStats: (id: string) => api.get(`/projects/${id}/stats`),
  assignWorker: (id: string, workerId: string) => api.post(`/projects/${id}/workers`, { workerId }),
  removeWorker: (id: string, workerId: string) => api.delete(`/projects/${id}/workers/${workerId}`),
};

export const tasksApi = {
  listByProject: (projectId: string, p?: { status?: string; limit?: number; offset?: number }) =>
    api.get(`/tasks/project/${projectId}`, { params: p }),
  get: (id: string) => api.get(`/tasks/${id}`),
  create: (d: object) => api.post("/tasks", d),
  update: (id: string, d: object) => api.patch(`/tasks/${id}`, d),
  updateProgress: (id: string, progress: number) => api.patch(`/tasks/${id}/progress`, { progress }),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  assignWorker: (id: string, workerId: string) => api.post(`/tasks/${id}/workers`, { workerId }),
  removeWorker: (id: string, workerId: string) => api.delete(`/tasks/${id}/workers/${workerId}`),
};

export const invoicesApi = {
  list: (p?: { status?: string; limit?: number; offset?: number }) => api.get("/invoices", { params: p }),
  get: (id: string) => api.get(`/invoices/${id}`),
  create: (d: object) => api.post("/invoices", d),
  update: (id: string, d: object) => api.patch(`/invoices/${id}`, d),
  delete: (id: string) => api.delete(`/invoices/${id}`),
  recordPayment: (id: string, d: object) => api.post(`/invoices/${id}/payments`, d),
};

export const workersApi = {
  list: (p?: { status?: string; limit?: number }) => api.get("/workers", { params: p }),
  get: (id: string) => api.get(`/workers/${id}`),
  create: (d: object) => api.post("/workers", d),
  update: (id: string, d: object) => api.patch(`/workers/${id}`, d),
  delete: (id: string) => api.delete(`/workers/${id}`),
};

export const invoicePeriodsApi = {
  list: (p?: { workerId?: string; limit?: number }) => api.get("/invoice-periods", { params: p }),
  get: (id: string) => api.get(`/invoice-periods/${id}`),
  create: (d: object) => api.post("/invoice-periods", d),
  update: (id: string, d: object) => api.patch(`/invoice-periods/${id}`, d),
  delete: (id: string) => api.delete(`/invoice-periods/${id}`),
};
