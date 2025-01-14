import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL: backendUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to handle user registration
export const registerUser = async (email, password) => {
    const data = {email, password};
    try {
        const response = await api.post('/register', data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Registration failed');
    }
};

// Function to handle user login
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

// Function to refresh the token
export const refreshToken = async (refresh_token) => {
    const data = {refresh_token};
    try {
        const response = await api.post('/refresh', data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Token refresh failed');
    }
};

// Function to handle user deletion
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

// Function to get user by ID
export const getUserById = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to fetch user');
    }
};