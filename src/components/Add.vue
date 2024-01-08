<script setup>
    import { ref } from 'vue'
    import { createApiUrl, createRequest, callApi } from '@/functions.js'

    const itemName = ref('')
    const clientTypeId = ref(0)
    const apiMessage = ref('')
    const apiError = ref('')
    const serviceTypeDescription = ref('')

    const props = defineProps({
        viewName: String,
        clientTypes: Array
    })

    const submitForm = async function () {
        const apiEndpoint = createApiUrl(view = props.itemType, action = 'add')

        let body;
        if (props.viewName === 'Clients') {
            body = { 'name': itemName.value, 'client_type_id': clientTypeId.value }
        }
        else if (props.viewName === 'Service Types') {
            body = { 'name': itemName.value, 'description': serviceTypeDescription.value }
        }

        const method = 'POST'
        const request = createRequest(method, body)
        const { code, response, error } = await callApi(apiEndpoint, request)
        apiMessage.value = ''
        apiError.value = ''
        if (code === 200) {
            apiMessage.value = `Client: ${itemName} created`
        }
        else if (code !== 200) {
            apiMessage.value = response.detail
        }
        else {
            apiError.value = error.message
        }
    }

</script>

<template>
    <div v-if="apiMessage">{{ apiMessage }}</div>
    <div v-if="apiError">{{ apiError }}</div>
    <form @submit.prevent="submitForm">
        <div v-if="props.viewName === 'Clients'">
            <input type="text" placeholder="client name" v-model="itemName">
            <select v-model="clientTypeId">
                <option v-for="clientType in clientTypes" :value="clientType.id">{{ clientType.name }}</option>
            </select>
        </div>
        <div v-else-if="props.viewName === 'Service Types'">
            <input type="text" placeholder="service type name" v-model="itemName" required>
            <input type="text" placeholder="description.....(optional)" v-model="serviceTypeDescription">
        </div>
        <button type="submit">Add</button>
    </form>
</template>