<script>
    import {createExpense, updateExpense} from '$lib/api';
    import {dataStore} from '$lib/stores/expenses';
    import {onMount} from 'svelte';

    export let selectedExpense = null;

    let amount = '';
    let category = '';
    let description = '';

    onMount(() => {
        if (selectedExpense) {
            amount = selectedExpense.amount;
            category = selectedExpense.category;
            description = selectedExpense.description;
        }
    });

    const handleSubmit = async () => {
        if (selectedExpense) {
            await updateExpense(selectedExpense.id, {amount, category, description});
            dataStore.update(store => {
                const index = store.expenses.findIndex(expense => expense.id === selectedExpense.id);
                store.expenses[index] = {...store.expenses[index], amount, category, description};
                return store;
            });
        } else {
            const newExpense = await createExpense({amount, category, description});
            dataStore.update(store => {
                store.expenses.push(newExpense);
                return store;
            });
        }
        // Reset form
        amount = '';
        category = '';
        description = '';
    };
</script>

<form on:submit|preventDefault={handleSubmit}>
    <label for="amount">Amount</label>
    <input id="amount" type="number" bind:value={amount}/>

    <label for="category">Category</label>
    <input id="category" type="text" bind:value={category}/>

    <label for="description">Description</label>
    <input id="description" type="text" bind:value={description}/>

    <button type="submit">{selectedExpense ? 'Update' : 'Add'} Expense</button>
</form>