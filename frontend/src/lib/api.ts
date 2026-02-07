import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add auth token interceptor
api.interceptors.request.use(async (config) => {
    try {
        const { auth } = await import("@/lib/firebase");
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error("Error attaching auth token:", error);
    }
    return config;
});

// API Functions
export const studentsApi = {
    getAll: (params?: { skip?: number; limit?: number; department_id?: number }) =>
        api.get("/students", { params }),
    getById: (id: number) => api.get(`/students/${id}`),
    create: (data: CreateStudentData) => api.post("/students", data),
    update: (id: number, data: Partial<CreateStudentData>) => api.put(`/students/${id}`, data),
    delete: (id: number) => api.delete(`/students/${id}`),
};

export const facultyApi = {
    getAll: (params?: { skip?: number; limit?: number }) =>
        api.get("/faculty", { params }),
    getById: (id: number) => api.get(`/faculty/${id}`),
    create: (data: CreateFacultyData) => api.post("/faculty", data),
};

export const departmentsApi = {
    getAll: (params?: { skip?: number; limit?: number }) =>
        api.get("/departments", { params }),
    getById: (id: number) => api.get(`/departments/${id}`),
    create: (data: CreateDepartmentData) => api.post("/departments", data),
};

export const subjectsApi = {
    getAll: (params?: { skip?: number; limit?: number }) =>
        api.get("/subjects", { params }),
    getById: (id: number) => api.get(`/subjects/${id}`),
    create: (data: CreateSubjectData) => api.post("/subjects", data),
};

export const usersApi = {
    getAll: (params?: { skip?: number; limit?: number }) =>
        api.get("/users", { params }),
    updateRole: (id: number, role: string) => api.put(`/users/${id}/role`, { role }),
    delete: (id: number) => api.delete(`/users/${id}`),
};

// Types
interface CreateStudentData {
    firebase_uid: string;
    email: string;
    first_name: string;
    last_name: string;
    roll_number: string;
    department_id: number;
    year: number;
    semester: number;
    phone?: string;
    address?: string;
}

interface CreateFacultyData {
    firebase_uid: string;
    email: string;
    first_name: string;
    last_name: string;
    employee_id: string;
    department_id: number;
    designation?: string;
    qualification?: string;
}

interface CreateDepartmentData {
    name: string;
    code: string;
    description?: string;
}

interface CreateSubjectData {
    name: string;
    code: string;
    credits: number;
    department_id: number;
}

export default api;
