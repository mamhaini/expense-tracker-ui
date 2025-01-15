<script>
    import { isAuthenticated } from '$lib/stores/auth';
    import { Circle } from 'svelte-loading-spinners';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    export let redirectIfUnauthenticated = null;
    export let redirectIfAuthenticated = null;

    let loading = true;
    let isAuth = false;

    onMount(() => {
        loading = true;
        isAuthenticated.checkAuth();
        const unsubscribe = isAuthenticated.subscribe(value => {
            isAuth = value.isAuthenticated;

            if (isAuth && redirectIfAuthenticated) {
                goto(redirectIfAuthenticated).then(() => {
                    loading = false;
                    redirectIfAuthenticated = null;
                });
            } else if (!isAuth && redirectIfUnauthenticated) {
                goto(redirectIfUnauthenticated).then(() => {
                    loading = false;
                    redirectIfUnauthenticated = null;
                });
            } else {
                loading = false;
            }
        });

        return () => {
            unsubscribe();
        };
    });
</script>

{#if loading}
    <div class="loading-container">
        <Circle size="60" color="#FF3E00" unit="px" duration="1s"/>
    </div>
{:else}
    <slot/>
{/if}