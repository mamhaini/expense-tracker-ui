<script>
    import {loginUser, registerUser, forgotPassword} from '$lib/api';
    import {isAuthenticated} from '$lib/stores/auth';
    import {failure, success} from "$lib/customToast.js";
    import './CombinedModal.css';
    import { goto } from '$app/navigation';


    let email = '';
    let password = '';
    let isLogin = true;
    let showForgotPassword = false;
    let forgotPasswordEmail = '';

    const handleLogin = async () => {
        try {
            const data = await loginUser(email, password);
            await isAuthenticated.login(data.access_token, data.refresh_token, email);
            await goto('/dashboard');
            success('Logged in successfully');
        } catch (err) {
            failure(err.message);
        }
    };

    const handleRegister = async () => {
        try {
            await registerUser(email, password);
            success('Confirmation email sent.');
        } catch (err) {
            failure(err.message);
        }
    };

    const handleForgotPassword = async () => {
        try {
            await forgotPassword(forgotPasswordEmail);
            success('Password reset email sent. Please check your email.');
        } catch (err) {
            failure(err.message);
        }
    };
</script>

<div class="modal">
    <div class="tabs">
        <button class:active={isLogin && !showForgotPassword}
                on:click={() => { isLogin = true; showForgotPassword = false; }}>Login
        </button>
        <button class:active={!isLogin && !showForgotPassword}
                on:click={() => { isLogin = false; showForgotPassword = false; }}>Register
        </button>
    </div>
    <div class="form-container">
        {#if showForgotPassword}
            <form on:submit|preventDefault={handleForgotPassword}>
                <label for="forgot-email">Enter your email to reset password</label>
                <input id="forgot-email" type="email" bind:value={forgotPasswordEmail} autocomplete="email" required/>

                <button type="submit">Send Reset Email</button>
            </form>
        {:else if isLogin}
            <form on:submit|preventDefault={handleLogin}>
                <label for="email">Email</label>
                <input id="email" type="email" bind:value={email} autocomplete="email" required/>

                <label for="password">Password</label>
                <input id="password" type="password" bind:value={password} required/>


                <button type="submit">Login</button>
                <span class="forgot-password" role="button" tabindex="0" on:click={() => showForgotPassword = true}
                      on:keydown={(e) => e.key === 'Enter' && (showForgotPassword = true)}>Forgot Password?</span>
            </form>
        {:else}
            <form on:submit|preventDefault={handleRegister}>
                <label for="email">Email</label>
                <input id="email" type="email" bind:value={email} autocomplete="email" required/>

                <label for="password">Password</label>
                <input id="password" type="password" bind:value={password} required/>

                <button type="submit">Register</button>
            </form>
        {/if}
    </div>
</div>