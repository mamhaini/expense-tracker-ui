import { writable } from 'svelte/store';

function createUserStore() {
    const { subscribe, set } = writable(null);

    return {
        subscribe,
        setUser: (userData) => set(userData),
        clearUser: () => set(null)
    };
}

export const userStore = createUserStore();