import { writable } from 'svelte/store';

function createUserStore() {
    let storedUser = null;
    if (typeof localStorage !== 'undefined') {
        storedUser = localStorage.getItem('user');
    }
    const { subscribe, set } = writable(storedUser ? JSON.parse(storedUser) : null);

    return {
        subscribe,
        setUser: (userData) => {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(userData));
            }
            set(userData);
        },
        clearUser: () => {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('user');
            }
            set(null);
        }
    };
}

export const userStore = createUserStore();