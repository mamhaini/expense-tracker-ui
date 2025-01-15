<script>
	import { dataStore } from '$lib/stores/expenses.js';
	import { updateExpense, deleteExpense } from '$lib/api.js';
	import { failure } from '$lib/customToast.js';
	import { get } from 'svelte/store';

	let expenses = get(dataStore);

	const handleInputChange = (index, field, value) => {
		expenses[index][field] = value;
	};

	const handleSave = async () => {
		try {
			for (const expense of expenses) {
				await updateExpense(expense.id, expense);
			}
		} catch (err) {
			failure(err.message);
		}
	};

	const handleDelete = async (expenseId) => {
		try {
			await deleteExpense(expenseId);
			expenses = expenses.filter(expense => expense.id !== expenseId);
		} catch (err) {
			failure(err.message);
		}
	};

	const handleNewExpense = () => {
		expenses = [...expenses, { description: '', amount: 0, category: '' }];
	};
</script>

<div class="header">
	<h1>Expenses</h1>
	<button on:click={handleNewExpense}>New Expense</button>
</div>

<table>
	<thead>
	<tr>
		<th>Description</th>
		<th>Amount</th>
		<th>Category</th>
		<th>Actions</th>
	</tr>
	</thead>
	<tbody>
	{#each expenses as expense, index}
		<tr>
			<td><input type="text" value={expense.description} on:input={(e) => handleInputChange(index, 'description', e.target.value)} /></td>
			<td><input type="number" value={expense.amount} on:input={(e) => handleInputChange(index, 'amount', e.target.value)} /></td>
			<td><input type="text" value={expense.category} on:input={(e) => handleInputChange(index, 'category', e.target.value)} /></td>
			<td><button on:click={() => handleDelete(expense.id)}>🗑️</button></td>
		</tr>
	{/each}
	</tbody>
</table>
<button on:click={handleSave}>Save Changes</button>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        background: linear-gradient(to bottom, #252424, #f0f0f0);
    }

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
    }

    th {
        background-color: #252424;
        color: white;
    }

    input {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
    }

    button {
        background: none;
        border: none;
        cursor: pointer;
    }

    button:hover {
        color: red;
    }

    .header button {
        background-color: #252424;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .header button:hover {
        background-color: #444;
    }
</style>