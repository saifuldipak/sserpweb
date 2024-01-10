<script setup>
    import { ref } from 'vue'
    import { createApiUrl, createRequest, callApi } from '@/functions.js'

    const itemName = ref('')
    const clientTypeId = ref(0)
    const apiMessage = ref('')
    const apiError = ref('')
    const serviceTypeDescription = ref('')
    const clientId = ref(0)
    const serviceType = ref('')
    const servicePoint = ref('')
    const popId = ref(0)
    const extraInfo = ref('')
    const bandwidth = ref(0)
    const clientName = ref('')
    const clientList = ref([])
    const vendorName = ref('')
    const vendorType = ref()
    const itemList = ref([])
    const popName = ref('')

    const props = defineProps({
        viewName: String,
        data: Array
    })

    const submitForm = async function () {
        const apiEndpoint = createApiUrl({ view: props.viewName, action: 'add' })

        let body;
        if (props.viewName === 'Clients') {
            body = { 'name': itemName.value, 'client_type_id': clientTypeId.value }
        }
        else if (props.viewName === 'Service Types') {
            body = { 'name': itemName.value, 'description': serviceTypeDescription.value }
        }
        else if (props.viewName === 'Vendors') {
            body = { name: vendorName.value, type: vendorType.value }
        }

        const method = 'POST'
        const request = createRequest(method, body)
        const { code, response, error } = await callApi(apiEndpoint, request)
        apiMessage.value = ''
        apiError.value = ''
        if (code === 200) {
            apiMessage.value = `Record added`
        }
        else if (code !== 200) {
            apiMessage.value = response.detail
        }
        else {
            apiError.value = error.message
        }
    }

    const searchRecord = async (searchItem) => {
        apiMessage.value = ''
        apiError.value = ''
        let apiEndpoint
        if (itemName.value.length > 2) {
            apiEndpoint = createApiUrl({ view: searchItem, action: 'search', searchString: itemName.value })
            const request = createRequest('GET')
            const { code, response, error } = await callApi(apiEndpoint, request)

            apiMessage.value = ''
            apiError.value = ''
            if (code === 200) {
                itemList.value = response
            }
            else if (code !== 200) {
                apiMessage.value = response.detail
            }
            else {
                apiError.value = error.message
            }
        }
    }

    const selectClient = (id, name) => {
        clientId.value = id
        clientName.value = name
        clientList.value = []
    }

</script>

<template>
    <div v-if="apiMessage">{{ apiMessage }}</div>
    <div v-if="apiError">{{ apiError }}</div>
    <form @submit.prevent="submitForm">
        <div v-if="props.viewName === 'Clients'">
            <input type="text" placeholder="client name" v-model="itemName">
            <select v-model="clientTypeId">
                <option v-for="item in props.data" :value="item.id">{{ item.name }}</option>
            </select>
        </div>
        <div v-else-if="props.viewName === 'Vendors'">
            <input type="text" placeholder="vendor name" v-model="vendorName">
            <select v-model="vendorType">
                <option v-for="item in props.data" :key="item.id" :value="item.name">{{ item.name }}</option>
            </select>
        </div>
        <div v-else-if="props.viewName === 'Services'">
            <input type="text" placeholder="Client name" v-model="itemName" @input="searchRecord('Clients')">
            <ul v-if="clientName.length > 0 && !apiMessage && !apiError" class="suggestions">
                <li class="suggestion" v-for="client in itemList" :key="client.id"
                    @click="selectClient(client.id, client.name)">{{
                        client.name }}
                </li>
            </ul>
            <input type="text" placeholder="Service location" v-model="servicePoint">
            <select v-model="serviceType">
                <option v-for="item in props.data" :value="item.id">{{ item.name }}</option>
            </select>
            <input type="number" placeholder="bandwidth value in Mbps" v-model="bandwidth">
            <input type="integer" placeholde="pop id" v-model="popId">
            <input type="text" placeholder="extra info" v-model="extraInfo">
        </div>
        <div v-else-if="props.viewName === 'Pops'">
            <input type="text" placeholder="Pop name" v-model="popName">
            <input type="text" placeholder="Vendor name" v-model="itemName" @input="searchRecord('Vendors')">
            <ul v-if="itemName.length > 0 && !apiMessage && !apiError" class="suggestions">
                <li class="suggestion" v-for="pop in itemList" :key="pop.id" @click="selectItem(pop.id, pop.name)">{{
                    item.name }}
                </li>
            </ul>


        </div>
        <div v-else-if="props.viewName === 'Service Types'">
            <input type="text" placeholder="service type name" v-model="itemName" required>
            <input type="text" placeholder="description.....(optional)" v-model="serviceTypeDescription">
        </div>
        <button type="submit">Add</button>
    </form>
</template>

<style scoped>
    .suggestions {
        list-style-type: none;
        padding: 0;
        margin: 0;
        border: 1px solid #ccc;
    }

    .suggestions li {
        padding: 8px;
        cursor: pointer;
    }

    .suggestions li:hover {
        background-color: #f2f2f2;
    }

    /* Ensure that the suggestions dropdown is displayed above other content */
    .suggestions {
        position: absolute;
        z-index: 1000;
    }
</style>