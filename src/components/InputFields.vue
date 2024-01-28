<script setup>
    import { defineModel } from 'vue';
    import InputSuggestion from './InputSuggestion.vue'

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
        }
    })

    const service = defineModel()
    const selectedSuggestion = (itemName, itemId) => {
        if (props.viewName === 'Services') {
            if (itemName === 'Clients') {
                service.value.clientId = itemId
            }
            else if (itemName === 'Pops') {
                service.value.popId = itemId
            }
        }
    }
</script>

<template>
    <!-- Services forms -->
    <div v-if="props.viewName === 'Services'">
        <InputSuggestion v-if="props.actionName === 'add'" :item-name="'Clients'" @selected-item-id="selectedSuggestion" />
        <InputSuggestion v-else-if="props.actionName === 'modify'" :item-name="'Clients'" :item-data="clientData"
            @selected-item-id="selectedSuggestion" />
        <input type="text" placeholder="Service location" v-model="service.point">
        <select v-model="service.serviceTypeId">
            <option disabled value="">service type</option>
            <option placeholder="service type" v-for="serviceType in serviceTypes" :value="serviceType.id">{{
                serviceType.name }}</option>
        </select>
        <input type="integer" placeholder="bandwidth value in Mbps" v-model="service.bandwidth">
        <InputSuggestion v-if="props.actionName === 'add'" :item-name="'Pops'" @selected-item-id="selectedSuggestion" />
        <InputSuggestion v-else-if="props.actionName === 'modify'" :item-name="'Pops'" :item-data="popData"
            @selected-item-id="selectedSuggestion" />
        <input type="text" placeholder="extra info" v-model="service.extraInfo">
        <button type="submit">Submit</button>
    </div>
</template>