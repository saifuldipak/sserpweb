<script setup>
    import AddressDetails from './AddressDetails.vue';
    import ContactDetails from './ContactDetails.vue';

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

    const emit = defineEmits(['closeComponent', 'searchItem'])
</script>

<template>
    <button @click="emit('closeComponent')">X</button>
    <ul v-if="props.viewName === 'Clients'" class="item-details">
        <li>Name: {{ props.itemDetails.name }}</li>
        <li>Type: {{ props.itemDetails.client_types.name }}</li>
        <li>Services:
            <a href="#" @click="emit('searchItem', 'Services', `client_name:${props.itemDetails.name}`)">
                <b>{{ props.itemDetails.services.length }}</b>
            </a>
        </li>
        <li>Contacts:
            <ul>
                <li v-for="contact in props.itemDetails.contacts" :key="contact.id">
                    <ContactDetails :item-details="contact" :view-name="props.viewName" />
                </li>
            </ul>
        </li>
        <li>Addresses:
            <ul>
                <li v-for="address in props.itemDetails.addresses" :key="address.id">
                    <AddressDetails :item-details="address" :view-name="props.viewName" />
                </li>
            </ul>
        </li>
    </ul>
    <ul v-if="props.viewName === 'Services'" class="item-details">
        <li>Client name: {{ props.itemDetails.clients.name }}</li>
        <li>Service point: {{ props.itemDetails.point }}</li>
        <li>Service type: {{ props.itemDetails.service_types.name }}</li>
        <li>Bandwidth: {{ props.itemDetails.bandwidth }}Mbps</li>
        <li>Pop: {{ props.itemDetails.pops.name }}</li>
        <li>Contacts:
            <ul>
                <li v-for="contact in props.itemDetails.contacts" :key="contact.id">
                    <ContactDetails :item-details="contact" :view-name="props.viewName" />
                </li>
            </ul>
        </li>
        <li>Addresses:
            <ul>
                <li v-for="address in props.itemDetails.addresses" :key="address.id">
                    <AddressDetails :item-details="address" :view-name="props.viewName" />
                </li>
            </ul>
        </li>
    </ul>
    <ul v-if="props.viewName === 'Service Types'" class="item-details">
        <li>Id: {{ props.itemDetails.id }}</li>
        <li>Service type: {{ props.itemDetails.name }}</li>
        <li>Description: {{ props.itemDetails.description }}</li>

    </ul>
    <ul v-if="props.viewName === 'Vendors'" class="item-details">
        <li>Id: {{ props.itemDetails.id }}</li>
        <li>Name: {{ props.itemDetails.name }}</li>
        <li>Type: {{ props.itemDetails.type }}</li>
    </ul>
    <ul v-if="props.viewName === 'Pops'" class="item-details">
        <li>Id: {{ props.itemDetails.id }}</li>
        <li>Name: {{ props.itemDetails.name }}</li>
        <li>Owner: {{ props.itemDetails.vendors.name }}</li>
        <li>Extra info: {{ props.itemDetails.extra_info }}</li>
    </ul>
    <ul v-if="props.viewName === 'Addresses'" class="item-details">
        <AddressDetails :item-details="itemDetails" :view-name="props.viewName" />
    </ul>
    <ul v-if="props.viewName === 'Contacts'" class="item-details">
        <ContactDetails :item-details="itemDetails" :view-name="props.viewName" />
    </ul>
</template>

<style scoped>
    .item-details {
        border: 1px solid grey;
        margin-top: 0;
    }
</style>