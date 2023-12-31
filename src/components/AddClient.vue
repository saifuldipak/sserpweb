<script setup>
    import { ref } from 'vue'
    import { API_URL, createRequestBody } from '@/config.js'

    const clientName = ref('')
    const clientTypeId = ref(0)
    const apiResponse = ref('')
    const apiError = ref('')

    const props = defineProps({
        clientTypes: Array
    })

    const addClient = async function () {
        apiResponse.value = ''
        apiError.value = ''
        const apiEndpoint = API_URL + 'clients/add'
        const method = 'POST'
        const body = { 'name': clientName.value, 'client_type_id': clientTypeId.value }
        const requestBody = createRequestBody(method, body)
        console.log(body)

        try {
            const response = await fetch(apiEndpoint, requestBody)
            if (response.status === 200) {
                apiResponse.value = `Client: ${clientName.value} created`
            }
            else {
                const responseData = await response.json()
                apiResponse.value = responseData.detail
            }
        }
        catch (error) {
            console.log(error)
            apiError.value = error.message
        }
    }

</script>

<template>
    <form @submit.prevent="addClient">
        <input type="text" placeholder="client name" v-model="clientName">
        <select v-model="clientTypeId">
            <option v-for="clientType in clientTypes" :value="clientType.id">{{ clientType.name }}</option>
        </select>
        <button type="submit">Add</button>
    </form>
    <div v-if="apiResponse">{{ apiResponse }}</div>
    <div v-if="apiError">{{ apiError }}</div>
</template>