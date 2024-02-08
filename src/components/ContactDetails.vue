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
    <div v-if="props.viewName === 'Contacts'">
        <li v-if="props.itemDetails.client_id">Client: {{ props.itemDetails.clients.name }}</li>
        <li v-else-if="props.itemDetails.service_id">Service: {{ props.itemDetails.services.point }}</li>
        <li v-else-if="props.itemDetails.vendor_id">Vendor: {{ props.itemDetails.vendors.name }}</li>
        <li>Name: {{ props.itemDetails.name }}</li>
        <li>Designation: {{ props.itemDetails.designation }}</li>
        <li>Type: {{ props.itemDetails.type }}</li>
        <li>Phone1: {{ props.itemDetails.phone1 }}</li>
        <li>Phone2: {{ props.itemDetails.phone2 }}</li>
        <li>Phone3: {{ props.itemDetails.phone3 }}</li>
    </div>
    <div v-else>
        <li>{{ props.itemDetails.name }}, {{ props.itemDetails.designation }}, {{
            props.itemDetails.phone1 }}</li>
    </div>
</template>