import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL: backendUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Users-related functions
export const registerUser = async (email, password) => {
    const data = {email, password};
    try {
        const response = await api.post('/register', data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Registration failed');
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await api.post(`/forgot-password?email=${encodeURIComponent(email)}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Password reset failed');
    }
};

export const loginUser = async (email, password) => {
    const data = {email, password};
    try {
        console.log(data)
        console.log(backendUrl)

        const response = await api.post('/login', data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Login failed');
    }
};

export const refreshToken = async (refresh_token) => {
    const data = {refresh_token};
    try {
        const response = await api.post('/refresh', data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Token refresh failed');
    }
};

export const deleteUser = async (user_email, token) => {
    try {
        const response = await api.delete(`/users/${user_email}`, {
            headers: {Authorization: `Bearer ${token}`},
        });
        return response.status === 204;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to delete user');
    }
};

export const getUserByEmail = async (email) => {
    try {
        const response = await api.get(`/users/${email}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to fetch user');
    }
};

// Expense-related functions
export const createExpense = async (expense) => {
    try {
        const response = await api.post('/expenses', expense);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to create expense');
    }
};

export const getExpenses = async (userEmail) => {
    try {
        const response = await api.get(`/expenses/${userEmail}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to fetch expenses');
    }
};

export const updateExpense = async (expenseId, expense) => {
    try {
        const response = await api.put(`/expenses/${expenseId}`, expense);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to update expense');
    }
};

export const deleteExpense = async (expenseId) => {
    try {
        await api.delete(`/expenses/${expenseId}`);
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to delete expense');
    }
};

// Category-related functions
export const createCategory = async (category) => {
    try {
        const response = await api.post('/categories', category);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to create category');
    }
};

export const getAllCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to fetch categories');
    }
};

export const getCategoryByName = async (categoryName) => {
    try {
        const response = await api.get(`/categories/${categoryName}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to fetch category');
    }
};

export const deleteCategory = async (categoryName) => {
    try {
        await api.delete(`/categories/${categoryName}`);
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to delete category');
    }
};


