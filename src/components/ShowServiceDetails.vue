<script setup>
    const props = defineProps({
        item: Object
    })

</script>

<template>
    <ul v-if="props.item" class="item-details">
        <li>Service point: {{ props.item.point }}</li>
        <li>Service type: {{ props.item.service_types.name }}</li>
        <li>Bandwidth: {{ props.item.bandwidth }}</li>
        <li>Client name: {{ props.item.clients.name }}</li>
        <li>Pop: {{ props.item.pops.name }}</li>
    </ul>
</template>

<style scoped>
    .item-details {
        border: 1px solid grey;
        margin-top: 0;
    }
</style>