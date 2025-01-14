<script>
    import CombinedModal from '$lib/components/authModal/CombinedModal.svelte';
    import { isAuthenticated } from '$lib/stores/auth';
    import { Circle } from 'svelte-loading-spinners';
    import { onMount } from 'svelte';

    let auth = false;
    let loading = true;

    onMount(() => {
        isAuthenticated.checkAuth();
        isAuthenticated.subscribe(value => {
            console.log('Auth value:', value);
            auth = value.isAuthenticated;
            loading = false;
            console.log('Loading:', loading, 'Auth:', auth);
        });
    });
</script>

<main>
    {#if loading}
        <Circle size="60" color="#FF3E00" unit="px" duration="1s"/>
    {:else if auth}
        <h1>Hello World</h1>
    {:else}
        <CombinedModal/>
    {/if}
</main>