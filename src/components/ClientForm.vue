<script setup>
    import { defineModel, onMounted } from 'vue';

    const props = defineProps({
        viewName: {
            type: String,
            required: true
        },
        actionName: {
            type: String,
            required: true
        },
        clientTypes: {
            type: Array,
            required: true
        }
    })

    const client = defineModel()
</script>

<template>
    <h4>{{ props.actionName }}</h4>
    <input type="text" placeholder="Client name" v-model="client.name">
    <select v-model="client.clientTypeId">
        <option disabled value="">client types</option>
        <option placeholder="client types" v-for="clientType in props.clientTypes" :value="clientType.id">{{
            clientType.name }}</option>
    </select>
</template>