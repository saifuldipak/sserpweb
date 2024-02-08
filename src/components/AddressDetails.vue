<script setup>
    const props = defineProps({
        viewName: {
            type: String,
            required: true
        },
        itemDetails: {
            type: Object,
            required: true
        }
    })
</script>
<template>
    <div v-if="props.viewName === 'Addresses'">
        <li v-if="props.itemDetails.client_id">Client: {{ props.itemDetails.clients.name }}</li>
        <li v-else-if="props.itemDetails.service_id">Service: {{ props.itemDetails.services.name }}</li>
        <li v-else-if="props.itemDetails.vendor_id">Vendor: {{ props.itemDetails.vendors.name }}</li>
        <li>Flat: {{ props.itemDetails.flat }}</li>
        <li>Floor: {{ props.itemDetails.floor }}</li>
        <li>Holding: {{ props.itemDetails.holding }}</li>
        <li>Street: {{ props.itemDetails.street }}</li>
        <li>Area: {{ props.itemDetails.area }}</li>
        <li>Thana: {{ props.itemDetails.thana }}</li>
        <li>District: {{ props.itemDetails.district }}</li>
    </div>
    <div v-else>
        Flat:{{ props.itemDetails.flat }},Floor:{{ props.itemDetails.floor }},Holding:{{ props.itemDetails.holding
        }},Street:{{
    props.itemDetails.street }},Area:{{ props.itemDetails.area }}
    </div>
</template>