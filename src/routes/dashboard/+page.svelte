<script>
    import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
    import AuthGuard from "$lib/components/AuthGuard.svelte";

</script>


<AuthGuard redirectIfUnauthenticated="/">
    <Dashboard />
</AuthGuard>
