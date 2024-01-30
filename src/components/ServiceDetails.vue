<script setup>
    import AddressDetails from './AddressDetails.vue';
    import ContactDetails from './ContactDetails.vue'

    const props = defineProps({
        itemDetails: {
            type: Object,
            required: true
        }
    })
    const emit = defineEmits(['closeComponent'])
</script>

<template>
    <button @click="emit('closeComponent', 'ServiceDetails')">X</button>
    <ul v-if="props.itemDetails" class="item-details">
        <li>Service point: {{ props.itemDetails.point }}</li>
        <li>Service type: {{ props.itemDetails.service_types.name }}</li>
        <li>Bandwidth: {{ props.itemDetails.bandwidth }}</li>
        <li>Client name: {{ props.itemDetails.clients.name }}</li>
        <li>Pop: {{ props.itemDetails.pops.name }}</li>
        <li v-if="props.itemDetails.contacts">Contacts:
            <ContactDetails :contacts="props.itemDetails.contacts" />
        </li>
        <li v-if="props.itemDetails.addresses">Addresses:
            <AddressDetails :addresses="props.itemDetails.addresses" />
        </li>
    </ul>
</template>

<style scoped>
    .item-details {
        border: 1px solid grey;
        margin-top: 0;
    }
</style>