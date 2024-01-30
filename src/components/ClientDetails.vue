<script setup>
    import { ref } from 'vue'
    import ContactDetails from './ContactDetails.vue'
    import AddressDetails from './AddressDetails.vue'

    const itemDetails = ref()

    const props = defineProps({
        itemDetails: {
            type: Object,
            required: true
        }
    })

    const emit = defineEmits(['closeComponent', 'showDetails'])

</script>

<template>
    <button @click="emit('closeComponent', 'ClientDetails')">X</button>
    <ul v-if="props.itemDetails" class="item-details">
        <li>Name: {{ props.itemDetails.name }}</li>
        <li>Type: {{ props.itemDetails.client_types.name }}</li>
        <li>Services:
            <ul v-for="service in props.itemDetails.services" :key="service.id">
                <li>{{ service.point }}</li>
            </ul>
        </li>
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