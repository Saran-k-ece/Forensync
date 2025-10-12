const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const evidenceApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/evidence`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch evidence');
    }

    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/evidence/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch evidence');
    }

    return response.json();
  },

  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/evidence/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update evidence');
    }

    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/evidence/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete evidence');
    }

    return response.json();
  },

  markViewed: async (id) => {
    const response = await fetch(`${API_BASE_URL}/evidence/${id}/mark-viewed`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to mark evidence as viewed');
    }

    return response.json();
  },
};
