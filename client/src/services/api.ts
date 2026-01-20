const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const courierApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/couriers`);
    if (!response.ok) throw new Error('Failed to fetch couriers');
    return response.json();
  },
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/couriers/${id}`);
    if (!response.ok) throw new Error('Failed to fetch courier');
    return response.json();
  },
  create: async (data: { fullName: string; workDistrict: string; maxCells?: number }) => {
    const response = await fetch(`${API_BASE_URL}/couriers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create courier');
    }
    return response.json();
  },
  update: async (id: string, data: { fullName?: string; workDistrict?: string; maxCells?: number }) => {
    const response = await fetch(`${API_BASE_URL}/couriers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update courier');
    }
    return response.json();
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/couriers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete courier');
  },
};

export const districtApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/districts`);
    if (!response.ok) throw new Error('Failed to fetch districts');
    return response.json();
  },
  create: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/districts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create district');
    }
    return response.json();
  },
};

export const taskApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },
  create: async (data: {
    orderDescription: string;
    cellsOccupied: number;
    deliveryDistrict: string;
    deliveryAddress: string;
    courierId: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create task');
    }
    return response.json();
  },
  transfer: async (taskId: string, newCourierId: string) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/transfer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newCourierId }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to transfer task');
    }
    return response.json();
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
  },
};
