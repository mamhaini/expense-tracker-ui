<script>
    import { isAuthenticated } from '$lib/stores/auth';
    import { loginUser, registerUser } from '$lib/api';

    let email = '';
    let password = '';
    let error = '';
    let success = '';
    let isLogin = true;

    const handleLogin = async () => {
        try {
            const data = await loginUser(email, password);
            isAuthenticated.login(data.access_token, data.refresh_token);
        } catch (err) {
            error = err.message;
        }
    };

    const handleRegister = async () => {
        try {
            await registerUser(email, password);
            success = 'Registration successful! Please check your email to confirm your account.';
            error = '';
        } catch (err) {
            error = err.message;
            success = '';
        }
    };
</script>

<style>
    @import './CombinedModal.css';
</style>

<div class="modal">
    <div class="tabs">
        <button class:active={isLogin} on:click={() => isLogin = true}>Login</button>
        <button class:active={!isLogin} on:click={() => isLogin = false}>Register</button>
    </div>
    <div class="form-container">
        {#if isLogin}
            <form on:submit|preventDefault={handleLogin}>
                <label for="email">Email</label>
                <input id="email" type="email" bind:value={email} required/>

                <label for="password">Password</label>
                <input id="password" type="password" bind:value={password} required/>

                {#if error}
                    <p class="error">{error}</p>
                {/if}

                <button type="submit">Login</button>
            </form>
        {:else}
            <form on:submit|preventDefault={handleRegister}>
                <label for="email">Email</label>
                <input id="email" type="email" bind:value={email} required/>

                <label for="password">Password</label>
                <input id="password" type="password" bind:value={password} required/>

                {#if error}
                    <p class="error">{error}</p>
                {/if}

                {#if success}
                    <p class="success">{success}</p>
                {/if}

                <button type="submit">Register</button>
            </form>
        {/if}
    </div>
</div>