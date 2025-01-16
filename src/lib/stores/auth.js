import { refreshToken, getUserByEmail } from '$lib/api';
import { writable } from 'svelte/store';
import { jwtDecode } from 'jwt-decode';
import { userStore } from './user';
import Cookies from 'js-cookie';
import { goto } from '$app/navigation';

function createAuthStore() {
	const { subscribe, set, update } = writable({ isAuthenticated: false, isRefreshing: false });

	const checkAuth = async () => {
		const token = Cookies.get('access_token');
		if (!token) {
			set({ isAuthenticated: false, isRefreshing: false });
			return;
		}

		const decoded = jwtDecode(token);
		const expiry = decoded.exp * 1000;
		if (new Date().getTime() < expiry) {
			set({ isAuthenticated: true, isRefreshing: false });
			return;
		}

		const refresh_token = Cookies.get('refresh_token');
		if (!refresh_token) {
			set({ isAuthenticated: false, isRefreshing: false });
			return;
		}

		update(state => ({ ...state, isRefreshing: true }));

		try {
			const data = await refreshToken(refresh_token);
			Cookies.set('access_token', data.access_token, { secure: true, sameSite: 'Strict' });
			set({ isAuthenticated: true, isRefreshing: false });
		} catch (error) {
			console.error('Failed to refresh token:', error);
			set({ isAuthenticated: false, isRefreshing: false });
		}
	};

	return {
		subscribe,
		checkAuth,
		login: async (access_token, refresh_token, email) => {
			Cookies.set('access_token', access_token, { secure: true, sameSite: 'Strict' });
			Cookies.set('refresh_token', refresh_token, { secure: true, sameSite: 'Strict' });
			set({ isAuthenticated: true, isRefreshing: false });

			try {
				const userData = await getUserByEmail(email);
				await userStore.setUser(userData);
			} catch (error) {
				console.error('Failed to fetch user data:', error);
			}
		},
		logout: async () => {
			Cookies.remove('access_token');
			Cookies.remove('refresh_token');
			set({ isAuthenticated: false, isRefreshing: false });
			await userStore.clearUser();
			await goto('/');
		}
	};
}

export const isAuthenticated = createAuthStore();