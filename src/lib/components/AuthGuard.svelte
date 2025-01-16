<script>
	import { isAuthenticated } from '$lib/stores/auth';
	import { Circle } from 'svelte-loading-spinners';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';

	export let redirectIfUnauthenticated = null;
	export let redirectIfAuthenticated = null;

	let loading = true;
	let isAuth = false;
	let unsubscribe;

	onMount(async () => {
		loading = true;
		await isAuthenticated.checkAuth();
		unsubscribe = isAuthenticated.subscribe(async value => {
			isAuth = value.isAuthenticated;

			if (isAuth && redirectIfAuthenticated) {
				await goto(redirectIfAuthenticated);
				loading = false;
				redirectIfAuthenticated = null;
			} else if (!isAuth && redirectIfUnauthenticated) {
				await goto(redirectIfUnauthenticated);
				loading = false;
				redirectIfUnauthenticated = null;
			} else {
				loading = false;
			}
		});
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});
</script>

{#if loading}
	<div class="loading-container">
		<Circle size="60" color="#FF3E00" unit="px" duration="1s" />
	</div>
{:else}
	<slot />
{/if}