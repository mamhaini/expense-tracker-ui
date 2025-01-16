<script>
	import { dataStore } from '$lib/stores/expenses.js';
	import { createExpense, updateExpense, deleteExpense } from '$lib/api.js';
	import { failure, warning, success } from '$lib/customToast.js';
	import { onDestroy, onMount, tick } from 'svelte';
	import { get } from 'svelte/store';
	import './ExpensesTable.css';
	import { v4 as uuidv4 } from 'uuid';

	let expenses = get(dataStore);
	let categories = [];
	let selectedExpenses = [];
	let editingExpenseId = null;
	let editingField = null;
	let inputRefs = {};
	let filters = {
		description: '',
		amount: '',
		category: '',
		payment_method: '',
		currency: '',
		is_recurring: '',
		updated_at_from: '',
		updated_at_to: ''
	};

	const unsubscribe = dataStore.subscribe(value => {
		expenses = value.expenses;
		categories = value.categories;
	});

	onDestroy(() => {
		unsubscribe();
	});

	const formatUpdatedAt = (updatedAt) => {
		return updatedAt ? new Date(updatedAt).toISOString().split('.')[0] : '';
	};

	const handleInputChange = (index, field, value) => {
		expenses[index][field] = value;
		expenses[index].isChanged = true;
		expenses[index].updated_at = formatUpdatedAt(new Date());
	};

	const handleSave = async () => {
		const changedExpenses = expenses.filter(expense => expense.isChanged);
		const newExpenses = expenses.filter(expense => expense.isNew);

		if (changedExpenses.length === 0 && newExpenses.length === 0) {
			warning('Nothing to save');
			return;
		}

		try {
			for (const expense of changedExpenses) {
				if (!expense.isNew) {
					await updateExpense(expense.id, expense);
					expense.isChanged = false;
				}
			}
			for (const expense of newExpenses) {
				const createdExpense = await createExpense(expense);
				expense.id = createdExpense.id;
				expense.isNew = false;

				// Update the data-id attribute of the row
				const row = document.querySelector(`tr[data-id="${expense.tempId}"]`);
				if (row) {
					row.setAttribute('data-id', createdExpense.id);
				}
			}
			success('Changes saved');

			// Uncheck all checkboxes after saving
			selectedExpenses = [];
		} catch (err) {
			failure(err.message);
		}
	};

	const handleDelete = async () => {
		if (selectedExpenses.length === 0) {
			warning('No expenses selected');
			return;
		}

		const newExpenses = selectedExpenses.filter(expenseId => {
			const expense = expenses.find(exp => exp.id === expenseId);
			return expense && expense.isNew;
		});

		expenses = expenses.filter(expense => !newExpenses.includes(expense.id));
		const savedExpenses = selectedExpenses.filter(expenseId => !newExpenses.includes(expenseId));

		// Add the deleted-row class to the rows being deleted
		savedExpenses.forEach(expenseId => {
			const row = document.querySelector(`tr[data-id="${expenseId}"]`);
			if (row) {
				// Force reflow before adding the class
				requestAnimationFrame(() => {
					row.classList.add('deleted-row');
				});
			}
		});

		// Wait for the animation to complete before removing the rows
		setTimeout(async () => {
			try {
				for (const expenseId of savedExpenses) {
					await deleteExpense(expenseId);
				}
				expenses = expenses.filter(expense => !savedExpenses.includes(expense.id));
				selectedExpenses = [];
			} catch (err) {
				failure(err.message);
			}
		}, 1000); // Duration of the animation
	};

	const handleNewExpense = () => {
		const tempId = uuidv4(); // Generate a temporary unique ID
		const newExpense = {
			tempId, // Assign the temporary ID
			id: tempId, // Use the temporary ID as the initial ID
			amount: 0,
			category: 'food', // default category
			description: '',
			payment_method: 'bank', // default payment method
			currency: 'USD', // default currency
			is_recurring: false,
			isNew: true
		};
		expenses = [...expenses, newExpense];
	};

	const handleSelectExpense = (expenseId) => {
		if (selectedExpenses.includes(expenseId)) {
			selectedExpenses = selectedExpenses.filter(id => id !== expenseId);
		} else {
			selectedExpenses = [...selectedExpenses, expenseId];
		}
	};

	const startEditing = async (expenseId, field) => {
		editingExpenseId = expenseId;
		editingField = field;
		await tick(); // Wait for the DOM to update
		if (inputRefs[`${expenseId}-${field}`]) {
			inputRefs[`${expenseId}-${field}`].focus();
		}
	};

	const stopEditing = () => {
		editingExpenseId = null;
		editingField = null;
	};

	const handleClickOutside = (event) => {
		if (!event.target.closest('table')) {
			stopEditing();
		}
	};

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	$: filteredExpenses = expenses.filter(expense => {
		return Object.keys(filters).every(key => {
			if (key === 'is_recurring') {
				return filters[key] === '' || expense[key] === (filters[key] === 'true');
			}
			if (key === 'updated_at_from' || key === 'updated_at_to') {
				const updatedAt = new Date(expense.updated_at);
				const from = filters.updated_at_from ? new Date(filters.updated_at_from) : null;
				const to = filters.updated_at_to ? new Date(filters.updated_at_to) : null;
				return (!from || updatedAt >= from) && (!to || updatedAt <= to);
			}
			return filters[key] === '' || expense[key].toString().toLowerCase().includes(filters[key]);
		});
	});
</script>

<div class="header">
	<h1>Expenses</h1>
	<div class="actions">
		<button on:click={handleNewExpense}>New Expense</button>
		<button on:click={handleDelete}>Delete Selected</button>
	</div>
</div>

<table>
	<thead>
	<tr>
		<th><input type="checkbox"
							 on:change={(e) => selectedExpenses = e.target.checked ? expenses.map(exp => exp.id) : []} /></th>
		<th>
			Description
			<input type="text" placeholder="Filter" bind:value={filters.description} />
		</th>
		<th>
			Amount
			<input type="number" placeholder="Filter" bind:value={filters.amount} />
		</th>
		<th>
			Category
			<select bind:value={filters.category}>
				<option value="">All</option>
				{#each categories as category}
					<option value={category.name}>{category.name}</option>
				{/each}
			</select>
		</th>
		<th class="payment-method">
			<select bind:value={filters.payment_method}>
				<option value="">All</option>
				<option value="bank">Bank</option>
				<option value="cash">Cash</option>
				<option value="credit_card">Credit Card</option>
				<option value="debit_card">Debit Card</option>
				<option value="digital_wallet">Digital Wallet</option>
			</select>
		</th>
		<th>
			Currency
			<select bind:value={filters.currency}>
				<option value="">All</option>
				<option value="USD">USD</option>
				<option value="EUR">EUR</option>
			</select>
		</th>
		<th>
			Recurring
			<select bind:value={filters.is_recurring}>
				<option value="">All</option>
				<option value="true">True</option>
				<option value="false">False</option>
			</select>
		</th>
		<th>
			Updated At
			<input type="date" placeholder="From" bind:value={filters.updated_at_from} />
			<input type="date" placeholder="To" bind:value={filters.updated_at_to} />
		</th>
	</tr>
	</thead>
	<tbody>
	{#each filteredExpenses as expense, index}
		<tr data-id={expense.id}>
			<td><input type="checkbox" checked={selectedExpenses.includes(expense.id)}
								 on:change={() => handleSelectExpense(expense.id)} /></td>
			<td class="clickable" on:click={() => startEditing(expense.id, 'description')}>
				{#if editingExpenseId === expense.id && editingField === 'description'}
					<input bind:this={inputRefs[`${expense.id}-description`]} value={expense.description}
								 on:input={(e) => handleInputChange(index, 'description', e.target.value)} on:blur={stopEditing} />
				{:else}
					<strong>{expense.description}</strong>
				{/if}
			</td>
			<td class="clickable" on:click={() => startEditing(expense.id, 'amount')}>
				{#if editingExpenseId === expense.id && editingField === 'amount'}
					<input type="number" bind:this={inputRefs[`${expense.id}-amount`]} value={expense.amount}
								 on:input={(e) => handleInputChange(index, 'amount', e.target.value)} on:blur={stopEditing} />
				{:else}
					<strong>{expense.amount}</strong>
				{/if}
			</td>
			<td>
				<select bind:value={expense.category} on:change={(e) => handleInputChange(index, 'category', e.target.value)}>
					{#each categories as category}
						<option value={category.name}>{category.name}</option>
					{/each}
				</select>
			</td>
			<td>
				<select bind:value={expense.payment_method}
								on:change={(e) => handleInputChange(index, 'payment_method', e.target.value)}>
					<option value="bank">Bank</option>
					<option value="cash">Cash</option>
					<option value="credit_card">Credit Card</option>
					<option value="debit_card">Debit Card</option>
					<option value="digital_wallet">Digital Wallet</option>
				</select>
			</td>
			<td>
				<select bind:value={expense.currency} on:change={(e) => handleInputChange(index, 'currency', e.target.value)}>
					<option value="USD">USD</option>
					<option value="EUR">EUR</option>
				</select>
			</td>
			<td>
				<input type="checkbox" bind:checked={expense.is_recurring}
							 on:change={(e) => handleInputChange(index, 'is_recurring', e.target.checked)} />
			</td>
			<td class="subtle">{formatUpdatedAt(expense.updated_at)}</td>
		</tr>
	{/each}
	</tbody>
</table>

<button class="save-changes-button" on:click={handleSave}>Save Changes</button>