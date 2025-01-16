<script>
	import UserLoader from '$lib/components/UserLoader.svelte';
	import { goto } from '$app/navigation';
	import ExpenseIcon from '$lib/components/svg/expense.svelte';
	import HomeIcon from '$lib/components/svg/home.svelte';
	import CategoryIcon from '$lib/components/svg/category.svelte';
	import { assets } from '$app/paths';
	import './_layout.css';
	import { isAuthenticated } from '$lib/stores/auth.js';
	import { failure, warning } from '$lib/customToast.js';
	import { deleteUser, getExpenses, getAllCategories } from '$lib/api.js';
	import { dataStore } from '$lib/stores/expenses.js';
	import { onMount } from 'svelte';
	import { Circle } from 'svelte-loading-spinners';

	let user = null;
	let showDropdown = false;
	let loading = true;

	onMount(async () => {
		await fetchData();
	});

	const fetchData = async () => {
		let attempts = 0;

		const waitForUser = new Promise((resolve, reject) => {
			const checkUser = () => {
				if (user && user.email) {
					resolve();
				} else if (attempts >= 3) {
					reject('Can\'t find user. Please re-log.');
				} else {
					const delay = attempts === 0 ? 0 : attempts === 1 ? 1000 : 3000;
					attempts++;
					setTimeout(checkUser, delay);
				}
			};
			checkUser();
		});

		try {
			await waitForUser;
			const fetchedExpenses = await getExpenses(user.email);
			const fetchedCategories = await getAllCategories(user.email);
			dataStore.update(store => {
				store.expenses = fetchedExpenses;
				store.categories = fetchedCategories;
				return store;
			});
			loading = false;
		} catch (err) {
			failure(err);
			await isAuthenticated.logout();
		}
	};

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

<UserLoader bind:user />

{#if loading}
	<div class="loading-container">
		<Circle size="60" color="#FF3E00" unit="px" duration="1s" />
	</div>
{:else}
	<div class="layout">
		<div class="main">
			<div class="sidebar">
				<div class="profile" role="button" tabindex="0" on:click={toggleDropdown}
						 on:keydown={(e) => e.key === 'Enter' && toggleDropdown()}>
					<img src="{assets}/default_pfp.png" alt="Profile">
					{#if user}<p>{user.email}</p>{/if}
					<div class="dropdown {showDropdown ? 'show' : ''}">
						<button on:click={logout}>Logout</button>
						<button on:click={deleteAccount}>Delete Account</button>
					</div>
				</div>
				<div class="nav">
					<button class="home-button" on:click={() => goto('/dashboard')}>
						<HomeIcon class="icon" fill="white" />
						Home
					</button>
					<button on:click={() => goto('/dashboard/expenses')}>
						<ExpenseIcon class="icon" fill="white" />
						Expenses
					</button>
					<button on:click={() => goto('/dashboard/categories')}>
						<CategoryIcon class="icon" fill="white" />
						Categories
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
{/if}
