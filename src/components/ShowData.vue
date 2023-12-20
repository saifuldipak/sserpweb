<script setup>
    import { ref } from 'vue'

    const props = defineProps({
        data: Array,
        dataType: String
    })

    const itemDetails = ref('')
</script>

<template>
    <div v-if="props.data">
        <table class="data-table">
            <tr v-for="item in props.data" :key="item.id" class="data">
                <td><a href="#" @click="itemDetails = item.name">{{ item.name }}</a></td>
                <td v-if="props.dataType === 'Clients'">{{ item.client_type.name }}</td>
                <td v-else-if="props.dataType === 'Contacts'"> {{ item.clients.name }}</td>
            </tr>
        </table>
        <div v-if="itemDetails">
            <div v-for="item in props.data" :key="item.id">
                <ul v-if="item.name === itemDetails">
                    <li>Name: {{ item.name }}</li>
                    <li>Type: {{ item.client_type.name }}</li>
                    <li>Services:
                        <ul v-for="service in item.services">
                            <li>{{ service.point }} ({{ service.bandwidth }}Mbps) ({{ service.extra_info }})</li>
                        </ul>
                    </li>
                    <li>Contacts:
                        <ul v-for="(contact, index) in item.contacts" :key="contact.id">
                            <span>{{ contact.name }}</span>
                            <ul>
                                <li>Designation: {{ contact.designation }}</li>
                                <li>Contact type: {{ contact.type }}</li>
                                <li>Phone: {{ contact.phone1 }}</li>
                            </ul>
                        </ul>
                    </li>
                    <li>Address:
                        <ul v-for="(address, index) in item.addresses" :key="address.id">
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
            </div>
        </div>
    </div>
</template>