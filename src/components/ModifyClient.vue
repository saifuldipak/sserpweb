<script setup>
    import { onMounted, ref } from 'vue'
    import { API_URL, createRequestBody } from '../config';

    const clientId = ref()
    const clientName = ref('')
    const clientTypeId = ref()
    const apiMessage = ref('')
    const apiError = ref('')

    const props = defineProps({
        clientId: Number,
        data: Array,
        clientTypes: Array
    })

    onMounted(() => {
        for (const client of props.data) {
            if (client.id == props.clientId) {
                clientId.value = client.id
                clientName.value = client.name
                clientTypeId.value = client.client_type_id
            }
        }
    })

    const modifyClient = async () => {
        apiError.value = ''
        apiMessage.value = ''

        const apiEndpoint = API_URL + 'clients/modify'
        const method = 'PUT'
        const body = { id: clientId.value, name: clientName.value, client_type_id: clientTypeId.value }
        const requestBody = createRequestBody(method, body)

        try {
            const response = await fetch(apiEndpoint, requestBody)
            if (response.status === 200) {
                apiMessage.value = 'Modification successfull'
            }
            else {
                const responseData = await response.json()
                apiMessage.value = responseData.detail
            }
        }
        catch (error) {
            console.log(error)
            apiError.value = error.message
        }
    }

    const handleSubmit = async () => {
        if (confirm('Are you sure you want to modify?')) {
            await modifyClient()
        }
    }
</script>

<template>
    <h4>Modify Client</h4>
    <div v-if="apiError">{{ apiError }}</div>
    <div v-if="apiMessage">{{ apiMessage }}</div>
    <div>Client Id: {{ clientId }}</div>
    <form @submit.prevent="handleSubmit">
        <label for="client-name">Client Name</label>
        <input type="text" id="client-name" v-model="clientName">
        <select v-model="clientTypeId">
            <option v-for="clientType in clientTypes" :value="clientType.id">{{ clientType.name }}
            </option>
        </select>
        <button type="submit">Modify</button>
    </form>
</template>