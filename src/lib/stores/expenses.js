import { writable } from 'svelte/store';

export const dataStore = writable({
    expenses: [],
    categories: []
});