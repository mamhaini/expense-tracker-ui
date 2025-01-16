import { writable } from 'svelte/store';

function createUserStore() {
    const { subscribe, set } = writable(null, () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            set(JSON.parse(storedUser));
        }
    });

    return {
        subscribe,
        setUser: async (userData) => {
            localStorage.setItem('user', JSON.stringify(userData));
            set(userData);
        },
        clearUser: async () => {
            localStorage.removeItem('user');
            set(null);
        },
        loadUser: async () => {
            const storedUser = localStorage.getItem('user');
            set(storedUser ? JSON.parse(storedUser) : null);
        }
    };
}

export const userStore = createUserStore();