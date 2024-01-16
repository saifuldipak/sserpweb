<script setup>
    const props = defineProps({
        actionName: String,
        required: true
    })
</script>
<template>
    <button v-if="props.actionName === 'add'" type="submit">Add</button>
    <button v-else-if="props.actionName === 'modify'" type="submit">Modify</button>
    <button v-else-if="props.actionName === 'delete'" type="submit">Delete</button>
</template>