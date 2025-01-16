<script>
	import { dataStore } from '$lib/stores/expenses.js';
	import { createCategory, deleteCategory } from '$lib/api.js';
	import { failure, success } from '$lib/customToast.js';
	import { get } from 'svelte/store';
	import './CategoriesTable.css';

	let categories = get(dataStore).categories;
	let newCategoryName = '';

	const handleAddCategory = async () => {
		try {
			const newCategory = await createCategory({ name: newCategoryName });
			categories = [...categories, newCategory];
			dataStore.update(store => {
				store.categories = categories;
				return store;
			});
			newCategoryName = '';
			success('Category added');
		} catch (err) {
			failure(err.message);
		}
	};

	const handleDelete = async (categoryName) => {
		try {
			const row = document.querySelector(`tr[data-name="${categoryName}"]`);
			if (row) {
				requestAnimationFrame(() => {
					row.classList.add('deleted-row');
				});
			}

			setTimeout(async () => {
				try {
					await deleteCategory(categoryName);
					categories = categories.filter(category => category.name !== categoryName);
					dataStore.update(store => {
						store.categories = categories;
						return store;
					});
				} catch (err) {
					failure(err.message);
				}
			}, 1000);
		} catch (err) {
			failure(err.message);
		}
	};
</script>

<div class="header">
	<h1>Expense Categories</h1>
	<div class="actions">
		<input type="text" bind:value={newCategoryName} placeholder="New category name" />
		<button class="add-category-button" on:click={handleAddCategory}>Add</button>
	</div>
</div>

<table>
	<thead>
	<tr>
		<th>Name</th>
		<th>Actions</th>
	</tr>
	</thead>
	<tbody>
	{#each categories as category}
		<tr data-name={category.name}>
			<td>{category.name}</td>
			<td>
				{#if category.id}
					<button on:click={() => handleDelete(category.name)}>Delete</button>
				{:else}
					Predefined
				{/if}
			</td>
		</tr>
	{/each}
	</tbody>
</table>