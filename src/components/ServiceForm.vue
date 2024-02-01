<script setup>
    import { defineModel } from 'vue';
    import InputSuggestion from './InputSuggestion.vue';

    const props = defineProps({
        viewName: {
            type: String,
            required: true
        },
        actionName: {
            type: String,
            required: true
        },
        serviceTypes: {
            type: Array,
            required: true
        }
    })

    const service = defineModel()
    const selectedSuggestion = (itemName, itemId) => {
        if (itemName === 'Clients') {
            service.value.client_id = itemId
        }
        else if (itemName === 'Pops') {
            service.value.pop_id = itemId
        }
    }
</script>

<template>
    <h4>{{ props.actionName }}</h4>
    <InputSuggestion v-if="props.actionName === 'Add'" :item-name="'Clients'" @selected-item-id="selectedSuggestion" />
    <InputSuggestion v-else-if="props.actionName === 'Modify'" :item-name="'Clients'" :item-data="service.clients"
        @selected-item-id="selectedSuggestion" />
    <input type="text" placeholder="Service location" v-model="service.point">
    <select v-model="service.service_type_id">
        <option disabled value="">service type</option>
        <option placeholder="service type" v-for="serviceType in serviceTypes" :value="serviceType.id">{{
            serviceType.name }}</option>
    </select>
    <input type="integer" placeholder="bandwidth value in Mbps" v-model="service.bandwidth">
    <InputSuggestion v-if="props.actionName === 'Add'" :item-name="'Pops'" @selected-item-id="selectedSuggestion" />
    <InputSuggestion v-else-if="props.actionName === 'Modify'" :item-name="'Pops'" :item-data="service.pops"
        @selected-item-id="selectedSuggestion" />
    <input type="text" placeholder="extra info" v-model="service.extra_info">
</template>