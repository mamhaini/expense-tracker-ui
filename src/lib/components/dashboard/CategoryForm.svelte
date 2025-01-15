<script>
    import { createCategory } from '$lib/api';
    import { dataStore } from '$lib/stores/expenses';

    let categoryName = '';

    const handleSubmit = async () => {
        const newCategory = await createCategory({ name: categoryName });
        dataStore.update(store => {
            store.categories.push(newCategory);
            return store;
        });
        // Reset form
        categoryName = '';
    };
</script>

<form on:submit|preventDefault={handleSubmit}>
    <label for="categoryName">Category Name</label>
    <input id="categoryName" type="text" bind:value={categoryName} />

    <button type="submit">Create Category</button>
</form>