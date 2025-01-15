<script>
    import AuthGuard from '$lib/components/AuthGuard.svelte';
    import {SvelteToast} from '@zerodevx/svelte-toast'

    import "../app.css";

</script>

<AuthGuard redirectIfAuthenticated="/dashboard">
    <slot/>
</AuthGuard>
<SvelteToast/>
