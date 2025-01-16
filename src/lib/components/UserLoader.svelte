<script>
	import { userStore } from '$lib/stores/user';
	import { onMount, onDestroy } from 'svelte';

	export let user = null;

	let unsubscribe;

	onMount(async () => {
		await userStore.loadUser();
		unsubscribe = userStore.subscribe(value => {
			user = value;
		});
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});
</script>