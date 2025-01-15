<script>
	import { userStore } from '$lib/stores/user';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import ExpenseIcon from '$lib/components/svg/expense.svelte';
	import HomeIcon from '$lib/components/svg/home.svelte';
	import { assets } from '$app/paths';
	import './_layout.css';
	import { isAuthenticated } from '$lib/stores/auth.js';
	import { failure, warning } from '$lib/customToast.js';
	import { deleteUser, getExpenses } from '$lib/api.js';
	import { dataStore } from '$lib/stores/expenses.js';
	import { onDestroy, onMount } from 'svelte';
	import { Circle } from 'svelte-loading-spinners';

	const user = get(userStore);
	let showDropdown = false;

	// ToDo fix infinite load on login
	let loading = true;
	let interval;

	const fetchData = async () => {
		const user = get(userStore);
		let attempts = 0;

		const tryFetchdata = async () => {
			if (user && user.email) {
				const fetchedExpenses = await getExpenses(user.email);
				dataStore.update(store => {
					store.expenses = fetchedExpenses;
					return store;
				});
				loading = false;
			} else {
				attempts++;
				if (attempts >= 3) {
					failure('Can\'t find user. Please re-log.');
					await isAuthenticated.logout();
				} else {
					setTimeout(tryFetchdata, 1000);
				}
			}
		};

		await tryFetchdata();
	};

	onMount(() => {
		fetchData();
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	const toggleDropdown = () => {
		showDropdown = !showDropdown;
	};

	const logout = async () => {
		await isAuthenticated.logout();
		warning('You have been logged out');
	};

	const deleteAccount = async () => {
		try {
			await deleteUser(user.email);
			warning('Account has been deleted');
		} catch (err) {
			failure(err.message);
		}
	};
</script>

{#if loading}
	<div class="loading-container">
		<Circle size="60" color="#FF3E00" unit="px" duration="1s" />
	</div>
{/if}
<div class="layout">
	<div class="main">
		<div class="sidebar">
			<div class="profile" role="button" tabindex="0" on:click={toggleDropdown}
					 on:keydown={(e) => e.key === 'Enter' && toggleDropdown()}>
				<img src="{assets}/default_pfp.png" alt="Profile">
				<p>{user.email}</p>
				<div class="dropdown {showDropdown ? 'show' : ''}">
					<button on:click={logout}>Logout</button>
					<button on:click={deleteAccount}>Delete Account</button>
				</div>
			</div>
			<div class="nav">
				<button on:click={() => goto('/dashboard')}>
					<HomeIcon class="icon" fill="white" />
					Home
				</button>
				<button on:click={() => goto('/dashboard/expenses')}>
					<ExpenseIcon class="icon" fill="white" />
					Expenses
				</button>
			</div>
		</div>

		<div class="borders">
			<div class="top-background"></div>
			<div class="main_content">
				<slot></slot>
			</div>
			<div class="bottom-background"></div>
			<div class="right-background"></div>
		</div>

	</div>
</div>