<script setup>
    import { ref } from 'vue'
    import { createApiUrl, createRequest, callApi } from '@/functions.js'

    const clientTypeId = ref()
    const apiMessage = ref('')
    const apiError = ref('')
    const serviceTypeDescription = ref('')
    const clientId = ref()
    const serviceTypeId = ref()
    const servicePoint = ref('')
    const extraInfo = ref('')
    const bandwidth = ref()
    const clientName = ref('')
    const vendorName = ref('')
    const vendorType = ref()
    const popName = ref('')
    const popList = ref([])
    const clientList = ref([])
    const popId = ref()
    const flatNumber = ref('')
    const floorNumber = ref('')
    const holdingNumber = ref('')
    const street = ref('')
    const areaName = ref('')
    const thana = ref('')
    const district = ref('')
    const serviceName = ref('')
    const serviceList = ref([])
    const serviceId = ref()
    const vendorId = ref()


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
        else if (props.viewName === 'Services') {
            body = { client_id: clientId.value, point: servicePoint.value, service_type_id: serviceTypeId.value, bandwidth: bandwidth.value, pop_id: popId.value, extra_info: extraInfo.value }
        }
        else if (props.viewName === 'Addresses') {
            body = {
                flat: flatNumber.value,
                floor: floorNumber.value,
                holding: holdingNumber.value,
                street: street.value,
                area: areaName.value,
                thana: thana.value,
                district: district.value,
                client_id: clientId.value,
                service_id: serviceId.value,
                vendor_id: vendorId.value,
                extra_info: extraInfo.value
            }
            console.log(body)
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

    /* const searchRecord = async (searchItem) => {
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
    } */
    const searchSuggestions = async (view) => {
        apiMessage.value = ''
        apiError.value = ''

        let itemName, itemList
        if (view === 'Clients') {
            itemName = clientName.value
        }
        else if (view === 'Pops') {
            itemName = popName.value
        }
        else if (view === 'Services') {
            itemName = serviceName.value
        }

        if (itemName.length > 2) {
            const apiEndpoint = createApiUrl({ view: view, action: 'search', searchString: itemName })
            const request = createRequest('GET')
            const { code, response, error } = await callApi(apiEndpoint, request)

            apiMessage.value = ''
            apiError.value = ''
            if (code === 200) {
                itemList = response
            }
            else if (code !== 200) {
                apiMessage.value = response.detail
            }
            else {
                apiError.value = error.message
            }
        }

        if (view === 'Clients') {
            clientList.value = itemList
        }
        else if (view === 'Pops') {
            popList.value = itemList
        }
        else if (view === 'Services') {
            serviceList.value = itemList
        }
    }

    /* const selectClient = (id, name) => {
        clientId.value = id
        clientName.value = name
        clientList.value = []
    } */

    const selectSuggestion = (view, id, name) => {
        if (view === 'Clients') {
            clientId.value = id
            clientName.value = name
            clientList.value = []
        }
        else if (view === 'Pops') {
            popId.value = id
            popName.value = name
            popList.value = []
        }
        else if (view === 'Services') {
            serviceId.value = id
            serviceName.value = name
            serviceList.value = []
        }
    }

</script>

<template>
    <div v-if="apiMessage">{{ apiMessage }}</div>
    <div v-if="apiError">{{ apiError }}</div>
    <form @submit.prevent="submitForm">
        <!-- Clients -->
        <div v-if="props.viewName === 'Clients'">
            <input type="text" placeholder="client name" v-model="itemName">
            <select v-model="clientTypeId">
                <option v-for="item in props.data" :value="item.id">{{ item.name }}</option>
            </select>
        </div>
        <!--Vendors-->
        <div v-else-if="props.viewName === 'Vendors'">
            <input type="text" placeholder="vendor name" v-model="vendorName">
            <select v-model="vendorType">
                <option v-for="item in props.data" :key="item.id" :value="item.name">{{ item.name }}</option>
            </select>
        </div>
        <!-- Services -->
        <!-- <div v-else-if="props.viewName === 'Services'" class="add-form">
            <input class="client-name" type="text" placeholder="Client name" v-model="itemName"
                @input="searchRecord('Clients')">
            <ul v-if="itemName.length > 0 && !apiMessage && !apiError" class="suggestions">
                <li class="suggestion" v-for="client in itemList" :key="client.id"
                    @click="selectClient(client.id, client.name)">{{
                        client.name }}
                </li>
            </ul>
            <input type="text" placeholder="Service location" v-model="servicePoint">
            <select v-model="serviceType" class="select-box">
                <option disabled value="">service type</option>
                <option placeholder="service type" v-for="item in props.data" :value="item.id">{{ item.name }}</option>
            </select>
            <input type="integer" placeholder="bandwidth value in Mbps" v-model="bandwidth">
            <input type="text" placeholder="Pop name" v-model="popName" @input="searchRecord('Pops')">
            <ul v-if="Name.length > 0 && !apiMessage && !apiError" class="suggestions">
                <li class="suggestion" v-for="pop in itemList" :key="pop.id" @click="selectItem(pop.id, pop.name)">{{
                    item.name }}
                </li>
            </ul>
            <input type="text" placeholder="extra info" v-model="extraInfo">
        </div> -->

        <div v-else-if="props.viewName === 'Services'" class="add-form">
            <input class="client-name" type="text" placeholder="Client name" v-model="clientName"
                @input="searchSuggestions('Clients')">
            <ul v-if="clientName.length > 0 && !apiMessage && !apiError" class="suggestions">
                <li class="suggestion" v-for="client in clientList" :key="client.id"
                    @click="selectSuggestion('Clients', client.id, client.name)">{{
                        client.name }}
                </li>
            </ul>
            <input type="text" placeholder="Service location" v-model="servicePoint">
            <select v-model="serviceTypeId" class="select-box">
                <option disabled value="">service type</option>
                <option placeholder="service type" v-for="item in props.data" :value="item.id">{{ item.name }}</option>
            </select>
            <input type="integer" placeholder="bandwidth value in Mbps" v-model="bandwidth">
            <input type="text" placeholder="Pop name" v-model="popName" @input="searchSuggestions('Pops')">
            <ul v-if="popName.length > 0 && !apiMessage && !apiError" class="suggestions">
                <li class="suggestion" v-for="pop in popList" :key="pop.id"
                    @click="selectSuggestion('Pops', pop.id, pop.name)">{{
                        pop.name }}
                </li>
            </ul>
            <input type="text" placeholder="extra info" v-model="extraInfo">
        </div>
        <!-- Pops -->
        <div v-else-if="props.viewName === 'Pops'">
            <input type="text" placeholder="Pop name" v-model="popName" @input="searchRecord('Pops')">
            <ul v-if="popName.length > 0 && !apiMessage && !apiError" class="suggestions">
                <li class="suggestion" v-for="pop in itemList" :key="pop.id" @click="selectItem(pop.id, pop.name)">{{
                    item.name }}
                </li>
            </ul>
        </div>
        <!-- Service Types -->
        <div v-else-if="props.viewName === 'Service Types'">
            <input type="text" placeholder="service type name" v-model="itemName" required>
            <input type="text" placeholder="description.....(optional)" v-model="serviceTypeDescription">
        </div>
        <!-- Addresses -->
        <div v-else-if="props.viewName === 'Addresses'" class="add-form">
            <input type="text" placeholder="Flat number" v-model="flatNumber">
            <input type="text" placeholder="Floor number" v-model="floorNumber">
            <input type="text" placeholder="Holding number" v-model="holdingNumber">
            <input type="text" placeholder="Street" v-model="street">
            <input type="text" placeholder="Area name" v-model="areaName">
            <input type="text" placeholder="Thana" v-model="thana">
            <input type="text" placeholder="District" v-model="district">
            <input class="client-name" type="text" placeholder="Client name" v-model="clientName"
                @input="searchSuggestions('Clients')">
            <ul v-if="clientName.length > 0 && !apiMessage && !apiError" class="suggestions">
                <li class="suggestion" v-for="client in clientList" :key="client.id"
                    @click="selectSuggestion('Clients', client.id, client.name)">{{
                        client.name }}
                </li>
            </ul>
            <input class="client-name" type="text" placeholder="Service name" v-model="serviceName"
                @input="searchSuggestions('Services')">
            <ul v-if="serviceName.length > 0 && !apiMessage && !apiError" class="suggestions">
                <li class="suggestion" v-for="service in serviceList" :key="service.id"
                    @click="selectSuggestion('Services', service.id, service.point)">{{
                        service.point }} {{ service.clients.name }}
                </li>
            </ul>
            <input type="text" placeholder="Vendor name" v-model="vendorName">
            <input type="text" placeholder="remark, description, landmark etc" v-model="extraInfo">
        </div>
        <button type="submit">Add</button>
    </form>
</template>

<style scoped>
    .client-name {
        position: relative;
    }

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
        background-color: grey;
        position: relative;
        z-index: 1000;
    }

    .add-form {
        width: 30%;
        display: flex;
        flex-direction: column;
    }

    .add-form input {
        display: block;
        padding: 5px;
        margin: 3px;
    }

    .select-box option:disabled {
        color: gray;
    }
</style>