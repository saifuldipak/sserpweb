<script setup>
    import { onMounted, ref } from 'vue'
    import { createApiUrl, createRequest } from '@/functions.js'
    import SubmitConfirm from './SubmitConfirm.vue';
    import SubmitButton from './SubmitButton.vue';

    const apiMessage = ref('')
    const apiError = ref('')
    const clientId = ref()
    const serviceTypeId = ref()
    const servicePoint = ref('')
    const extraInfo = ref('')
    const bandwidth = ref()
    const clientName = ref('')
    const popName = ref('')
    const popList = ref([])
    const clientList = ref([])
    const popId = ref()
    const serviceName = ref('')
    const serviceList = ref([])
    const serviceId = ref()
    const serviceTypes = ref()
    const dialogVisible = ref(false)
    const showDetails = ref(true)
    const showForm = ref(true)

    const props = defineProps({
        actionName: {
            type: String,
            required: true
        },
        itemData: {
            type: Object,
        }
    })

    const submitForm = async () => {
        let apiEndpoint = createApiUrl({ view: 'Services', action: props.actionName })
        let body, method
        if (props.actionName === 'add') {
            method = 'POST'
            body = {
                client_id: clientId.value,
                point: servicePoint.value,
                service_type_id: serviceTypeId.value,
                bandwidth: bandwidth.value,
                pop_id: popId.value,
                extra_info: extraInfo.value
            }
        }
        else if (props.actionName === 'modify') {
            method = 'PUT'
            body = {
                id: serviceId.value,
                client_id: clientId.value,
                point: servicePoint.value,
                service_type_id: serviceTypeId.value,
                bandwidth: bandwidth.value,
                pop_id: popId.value,
                extra_info: extraInfo.value

            }
        }
        else if (props.actionName === 'delete') {
            method = 'DELETE'
            body = ''
            apiEndpoint = apiEndpoint + '/' + serviceId.value
        }

        const request = createRequest(method, body)
        try {
            const response = await fetch(apiEndpoint, request)

            if (response.ok) {
                if (props.actionName === 'add') {
                    apiMessage.value = 'Service added'
                }
                else if (props.actionName === 'modify') {
                    apiMessage.value = 'Service modified'
                }
                else if (props.actionName === 'delete') {
                    apiMessage.value = 'Service deleted'
                    showDetails.value = false
                    showForm.value = false
                }
            }
            else {
                const data = await response.json()
                apiMessage.value = data.detail
            }
        }
        catch (error) {
            console.error(error)
            apiError.value = error.message
        }
        finally {
            closeDialog()
        }
    }

    const searchSuggestions = async (view) => {
        apiMessage.value = ''
        apiError.value = ''

        let itemName
        if (view === 'Clients') {
            itemName = clientName.value
        }
        else if (view === 'Pops') {
            itemName = popName.value
        }
        else if (view === 'Services') {
            itemName = serviceName.value
        }


        let itemList
        if (itemName.length > 2) {
            const apiEndpoint = createApiUrl({ view: view, action: 'search', searchString: itemName })
            const request = createRequest('GET')

            apiMessage.value = ''
            apiError.value = ''
            try {
                const response = await fetch(apiEndpoint, request)
                if (response.status === 200) {
                    itemList = await response.json()
                }
                else {
                    const data = await response.json()
                    apiMessage.value = data.detail
                }
            }
            catch (error) {
                console.error(error)
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

    onMounted(async () => {
        apiMessage.value = ''
        apiError.value = ''
        const apiEndpoint = createApiUrl({ view: 'Service Types', action: 'search' })
        const request = createRequest('GET')

        try {
            const response = await fetch(apiEndpoint, request)
            if (response.status === 200) {
                serviceTypes.value = await response.json()
            }
            else {
                const data = await response.json()
                apiMessage.value = data.detail
            }
        }
        catch (error) {
            console.error(error)
            apiError.value = error.message
        }

        if (props.actionName === 'modify' || props.actionName === 'delete') {
            serviceId.value = props.itemData.id
            selectSuggestion('Clients', props.itemData.client_id, props.itemData.clients.name)
            servicePoint.value = props.itemData.point
            serviceTypeId.value = props.itemData.service_type_id
            bandwidth.value = props.itemData.bandwidth
            selectSuggestion('Pops', props.itemData.pop_id, props.itemData.pops.name)
            extraInfo.value = props.itemData.extra_info
        }
    })

    const closeDialog = () => {
        dialogVisible.value = false;
    };

    const handleSubmit = async () => {
        dialogVisible.value = true
    }
</script>

<template>
    <h3 v-if="props.actionName === 'add'">Add Service</h3>
    <h3 v-else-if="props.actionName === 'modify'">Modify Service</h3>
    <h3 v-else-if="props.actionName === 'delete'">Delete Service</h3>
    <div v-if="apiMessage">{{ apiMessage }}</div>
    <div v-if="apiError">{{ apiError }}</div>

    <div class="details" v-if="showDetails">
        <span v-if="props.actionName === 'modify' || props.actionName === 'delete'">Service Id: {{ serviceId }}</span>
        <span v-if="props.actionName === 'delete'">Service Point: {{ servicePoint }}</span>
        <span v-if="props.actionName === 'delete'">Client Name: {{ clientName }}</span>
    </div>
    <div class="data-form" v-if="showForm">
        <form @submit.prevent="handleSubmit">
            <div class='form-fields' v-if="props.actionName === 'add' || props.actionName === 'modify'">
                <input class="client-name" type="text" placeholder="Client name" v-model="clientName"
                    @input="searchSuggestions('Clients')">
                <ul v-if="clientName.length > 0 && !apiMessage && !apiError" class="suggestions">
                    <li class="suggestion" v-for="client in clientList" :key="client.id"
                        @click="selectSuggestion('Clients', client.id, client.name)">{{ client.name }}
                    </li>
                </ul>
                <input type="text" placeholder="Service location" v-model="servicePoint">
                <select v-model="serviceTypeId" class="select-box">
                    <option disabled value="">service type</option>
                    <option placeholder="service type" v-for="serviceType in serviceTypes" :value="serviceType.id">{{
                        serviceType.name }}</option>
                </select>
                <input type="integer" placeholder="bandwidth value in Mbps" v-model="bandwidth">
                <input type="text" placeholder="Pop name" v-model="popName" @input="searchSuggestions('Pops')">
                <ul v-if="popName.length > 0 && !apiMessage && !apiError" class="suggestions">
                    <li class="suggestion" v-for="pop in popList" :key="pop.id"
                        @click="selectSuggestion('Pops', pop.id, pop.name)">
                        {{ pop.name }}
                    </li>
                </ul>
                <input type="text" placeholder="extra info" v-model="extraInfo">
            </div>
            <div class="buttons">
                <SubmitButton :action-name="props.actionName" />
                <SubmitConfirm v-model:show="dialogVisible" :action-name="props.actionName" @confirm="submitForm"
                    @cancel="closeDialog" />
            </div>
        </form>
    </div>
</template>

<style scoped>
    .client-name {
        position: relative;
    }

    .suggestions {
        list-style-type: none;
        padding: 0;
        margin: 0;
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

    .select-box option:disabled {
        color: gray;
    }
</style>