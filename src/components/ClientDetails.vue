<script setup>
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
        <li>Contacts:
            <ul v-for="(contact, index) in props.item.contacts" :key="contact.id">
                <span>{{ contact.name }}</span>
                <ul>
                    <li>Designation: {{ contact.designation }}</li>
                    <li>Contact type: {{ contact.type }}</li>
                    <li>Phone: {{ contact.phone1 }}</li>
                </ul>
            </ul>
        </li>
        <li>Address:
            <ul v-for="(address, index) in props.item.addresses" :key="address.id">
                <span>{{ address.extra_info }}</span>
                <ul>
                    <li>Flat: {{ address.flat }}</li>
                    <li>Floor: {{ address.floor }}</li>
                    <li>Holding: {{ address.holding }}</li>
                    <li>Street: {{ address.street }}</li>
                    <li>Area: {{ address.area }}</li>
                    <li>Thana: {{ address.thana }}</li>
                    <li>District: {{ address.district }}</li>
                </ul>
            </ul>
        </li>
    </ul>
</template>

<style scoped>
    .item-details {
        border: 1px solid grey;
        margin-top: 0;
    }
</style>