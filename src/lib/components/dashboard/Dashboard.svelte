<script>
    import ExpenseForm from '$lib/components/dashboard/ExpenseForm.svelte';
    import CategoryForm from '$lib/components/dashboard/CategoryForm.svelte';
    import {getExpenses, deleteExpense} from '$lib/api';
    import {dataStore} from '$lib/stores/expenses';
    import {userStore} from '$lib/stores/user';
    import {onMount} from 'svelte';
    import {get} from 'svelte/store';

    let selectedExpense = null;

    onMount(async () => {
        const user = get(userStore);
        console.log(user);
        if (user && user.email) {
            const fetchedExpenses = await getExpenses(user.email);
            dataStore.update(store => {
                store.expenses = fetchedExpenses;
                return store;
            });
        }
    });

    const handleEdit = (expense) => {
        selectedExpense = expense;
    };

    const handleDelete = async (expenseId) => {
        await deleteExpense(expenseId);
        dataStore.update(store => {
            store.expenses = store.expenses.filter(expense => expense.id !== expenseId);
            return store;
        });
    };
</script>

<main>
    <h1>Welcome to the Dashboard</h1>
    <h2>Expenses</h2>
    <ul>
        {#each $dataStore.expenses as expense}
            <li>
                {expense.description} - {expense.amount} - {expense.category}
                <button on:click={() => handleEdit(expense)}>Edit</button>
                <button on:click={() => handleDelete(expense.id)}>Delete</button>
            </li>
        {/each}
    </ul>

    <h2>Add or Update Expense</h2>
    <ExpenseForm {selectedExpense}/>

    <h2>Create New Category</h2>
    <CategoryForm/>
</main>