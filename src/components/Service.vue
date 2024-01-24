<script setup>
    import { onMounted, ref, watchEffect } from 'vue'
    import { createApiUrl, createRequest, isEqualObjects } from '@/functions.js'
    import SubmitConfirm from './SubmitConfirm.vue';
    import SubmitButton from './SubmitButton.vue';
    import SearchSuggestion from './SearchSuggestion.vue';

    const apiMessage = ref('')
    const apiError = ref('')
    const clientId = ref()
    const serviceTypeId = ref()
    const servicePoint = ref('')
    const extraInfo = ref('')
    const bandwidth = ref('')
    const clientName = ref('')
    const popName = ref('')
    const popList = ref([])
    const clientList = ref([])
    const popId = ref()
    const serviceId = ref()
    const serviceTypes = ref()
    const dialogVisible = ref(false)
    const showDetails = ref(false)
    const showForm = ref(true)
    const message = ref('')
    const messageType = ref('')
    const showButton = ref(true)
    const showHeader = ref(true)
    const clientData = ref({
        id: '',
        name: ''
    })
    const popData = ref({
        id: '',
        name: ''
    })

    const props = defineProps({
        actionName: {
            type: String,
            required: true
        },
        itemData: {
            type: Object,
        }
    })

    const emit = defineEmits(['showNotification'])

    const checkInputs = () => {
        if (!clientId.value || !servicePoint.value || !serviceTypeId.value || !bandwidth.value || !popId.value) {
            return false
        }

        if (props.actionName === 'modify') {
            if (!serviceId.value) {
                return false
            }
        }

        return true
    }

    const submitForm = async () => {
        if (props.actionName === 'add' || props.actionName === 'modify') {
            const inputsCorrect = checkInputs()
            if (!inputsCorrect) {
                message.value = 'Need to give inputs to all fields'
                messageType.value = 'Error'
                emit('showNotification', message.value, messageType.value)
                closeDialog()
                return
            }
        }
        if (props.actionName === 'modify') {
            const oldData = {
                id: props.itemData.id,
                clientId: props.itemData.client_id,
                servicePoint: props.itemData.point,
                serviceTypeId: props.itemData.service_type_id,
                bandwidth: props.itemData.bandwidth,
                popId: props.itemData.pop_id,
                extraInfo: props.itemData.extra_info
            }
            const newData = {
                id: serviceId.value,
                clientId: clientId.value,
                servicePoint: servicePoint.value,
                serviceTypeId: serviceTypeId.value,
                bandwidth: bandwidth.value,
                popId: popId.value,
                extraInfo: extraInfo.value
            }

            const [result, message, messageType] = isEqualObjects(oldData, newData)
            if (result) {
                emit('showNotification', message, messageType)
                closeDialog()
                return
            }
        }

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
                    message.value = 'Service added'
                }
                else if (props.actionName === 'modify') {
                    message.value = 'Service modified'
                }
                else if (props.actionName === 'delete') {
                    message.value = 'Service deleted'
                }
                messageType.value = 'Info'
                emit('showNotification', message.value, messageType.value)
                showHeader.value = false
                showDetails.value = false
                showForm.value = false
            }
            else {
                const data = await response.json()
                console.error(data)
                message.value = 'Data validation error'
                messageType.value = 'Error'
                emit('showNotification', message.value, messageType.value)
            }
        }
        catch (error) {
            console.error(error)
            message.value = error.message
            messageType.value = 'Error'
        }
        finally {
            closeDialog()
        }
    }

    const selectedSuggestion = (view, id, name) => {
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
                message.value = data.detail
                messageType.value = 'Error'
            }
        }
        catch (error) {
            console.error(error)
            message.value = error.message
            messageType.value = 'Error'
        }
    })

    watchEffect(() => {
        if (props.actionName === 'modify' || props.actionName === 'delete') {
            serviceId.value = props.itemData.id
            clientData.value.id = props.itemData.clients.id
            clientData.value.name = props.itemData.clients.name
            servicePoint.value = props.itemData.point
            serviceTypeId.value = props.itemData.service_type_id
            bandwidth.value = props.itemData.bandwidth
            popData.value.id = props.itemData.pops.id
            popData.value.name = props.itemData.pops.name
            extraInfo.value = props.itemData.extra_info
            showDetails.value = true
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
    <div v-if="showHeader">
        <h3 v-if="props.actionName === 'add'">Add Service</h3>
        <h3 v-else-if="props.actionName === 'modify'">Modify Service</h3>
        <h3 v-else-if="props.actionName === 'delete'">Delete Service</h3>
    </div>
    <div class="details" v-if="showDetails">
        <span v-if="props.actionName === 'modify' || props.actionName === 'delete'">Service Id: {{ serviceId }}</span>
        <span v-if="props.actionName === 'delete'">Service Point: {{ servicePoint }}</span>
        <span v-if="props.actionName === 'delete'">Client Name: {{ clientName }}</span>
    </div>
    <div class="data-form" v-if="showForm">
        <form @submit.prevent="handleSubmit">
            <div class='form-fields' v-if="props.actionName === 'add' || props.actionName === 'modify'">
                <SearchSuggestion v-if="props.actionName === 'add'" :view-name="'Clients'"
                    @selected-item-id="selectedSuggestion" />
                <SearchSuggestion v-else-if="props.actionName === 'modify'" :view-name="'Clients'" :item-data="clientData"
                    @selected-item-id="selectedSuggestion" />
                <input type="text" placeholder="Service location" v-model="servicePoint">
                <select v-model="serviceTypeId" class="select-box">
                    <option disabled value="">service type</option>
                    <option placeholder="service type" v-for="serviceType in serviceTypes" :value="serviceType.id">{{
                        serviceType.name }}</option>
                </select>
                <input type="integer" placeholder="bandwidth value in Mbps" v-model="bandwidth">
                <SearchSuggestion v-if="props.actionName === 'add'" :view-name="'Pops'"
                    @selected-item-id="selectedSuggestion" />
                <SearchSuggestion v-else-if="props.actionName === 'modify'" :view-name="'Pops'" :item-data="popData"
                    @selected-item-id="selectedSuggestion" />
                <input type="text" placeholder="extra info" v-model="extraInfo">
            </div>
            <div v-if="showButton">
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