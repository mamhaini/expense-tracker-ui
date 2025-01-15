<script>
	import Layout from '$lib/components/dashboard/_layout.svelte';
	import AuthGuard from '$lib/components/AuthGuard.svelte';
</script>

<AuthGuard redirectIfUnauthenticated="/">
	<Layout>
		<slot></slot>
	</Layout>
</AuthGuard>