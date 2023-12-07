<script setup>
    import { ref } from 'vue'

    const clientName = ref('')
    const emit = defineEmits(['getData'])
    const props = defineProps({
        viewType: String
    })

</script>

<template>
    <div class="header-section">
        <h2 class="heading">{{ props.viewType }}</h2>
        <div class="tool-bar">
            <form @submit.prevent="$emit('search', props.viewType, clientName)">
                <input type="text" placeholder="Enter text..." v-model="clientName" required />
                <button type="submit">Search</button>
            </form>
            <div>
                <button class="add-button">+Add</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .page-header-section {
        width: 95%;
        margin: auto;
    }

    .tool-bar {
        display: flex;
        justify-content: space-between;
    }

    .data-table {
        width: 95%;
    }
</style>