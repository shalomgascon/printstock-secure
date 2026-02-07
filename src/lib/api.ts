// API service layer for PrintFlow backend communication

const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'staff';
  };
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'staff';
  };
}

function getAuthHeaders(): HeadersInit {
  const token = sessionStorage.getItem('printflow_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || `Request failed (${response.status})` };
    }

    return { data };
  } catch (error) {
    // Check if backend is unreachable
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { error: 'Cannot connect to server. Make sure the backend is running on port 5000.' };
    }
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

// Auth API calls
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, role: 'admin' | 'manager' | 'staff') =>
    apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),
};

export { type LoginResponse, type RegisterResponse };
