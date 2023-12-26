<script setup>
    import AddressDetails from './AddressDetails.vue';
    import ContactDetails from './ContactDetails.vue'

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
        <li v-if="props.item.contacts">Contacts:
            <ContactDetails :contacts="props.item.contacts" />
        </li>
        <li v-if="props.item.addresses">Addresses:
            <AddressDetails :addresses="props.item.addresses" />
        </li>
    </ul>
</template>

<style scoped>
    .item-details {
        border: 1px solid grey;
        margin-top: 0;
    }
</style>