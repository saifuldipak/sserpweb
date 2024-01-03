<script setup>
    import { ref } from 'vue'
    import { API_URL, createRequestBody } from '@/config.js'

    const itemName = ref('')
    const clientTypeId = ref(0)
    const apiResponse = ref('')
    const apiError = ref('')
    const serviceTypeDescription = ref('')

    const props = defineProps({
        itemType: String,
        clientTypes: Array
    })

    const submitForm = async function () {
        let apiEndpoint, body
        apiResponse.value = ''
        apiError.value = ''
        const method = 'POST'

        if (props.itemType === 'Clients') {
            apiEndpoint = API_URL + 'clients/add'
            body = { 'name': itemName.value, 'client_type_id': clientTypeId.value }
        }
        else if (props.itemType === 'Service Types') {
            apiEndpoint = API_URL + 'service/type/add'
            body = { 'name': itemName.value, 'description': serviceTypeDescription.value }
        }

        const requestBody = createRequestBody(method, body)

        try {
            const response = await fetch(apiEndpoint, requestBody)
            if (response.status === 200) {
                apiResponse.value = `${props.itemType}: '${itemName.value}'' created`
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
    <div v-if="apiResponse">{{ apiResponse }}</div>
    <div v-if="apiError">{{ apiError }}</div>
    <form @submit.prevent="submitForm">
        <div v-if="props.itemType === 'Clients'">
            <input type="text" placeholder="client name" v-model="itemName">
            <select v-model="clientTypeId">
                <option v-for="clientType in clientTypes" :value="clientType.id">{{ clientType.name }}</option>
            </select>
        </div>
        <div v-else-if="props.itemType === 'Service Types'">
            <input type="text" placeholder="service type name" v-model="itemName" required>
            <input type="text" placeholder="description.....(optional)" v-model="serviceTypeDescription">
        </div>
        <button type="submit">Add</button>
    </form>
</template>