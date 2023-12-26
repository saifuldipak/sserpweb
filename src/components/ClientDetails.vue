<script setup>
    import ContactDetails from './ContactDetails.vue';
    import AddressDetails from './AddressDetails.vue';

    const props = defineProps({
        item: Object
    })

</script>

<template>
    <ul v-if="props.item" class="item-details">
        <li>Name: {{ props.item.name }}</li>
        <li>Type: {{ props.item.client_type.name }}</li>
        <li>Services:
            <ul v-for="service in props.item.services">
                <li>{{ service.point }} ({{ service.bandwidth }}Mbps) ({{ service.extra_info }})
                </li>
            </ul>
        </li>
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