<script setup>
    import { computed, ref } from 'vue'
    import { API_URL, createRequestBody } from '../config';
    import SubmitConfirm from './SubmitConfirm.vue'

    const clientId = ref()
    const clientName = ref('')
    const clientTypeId = ref()
    const apiMessage = ref('')
    const apiError = ref('')
    const dialogVisible = ref(false);
    const showForm = ref(true)
    const actionType = ref('modify')

    const props = defineProps({
        itemData: Object,
        itemType: String,
        clientTypes: Array
    })

    clientId.value = props.itemData.id
    clientName.value = props.itemData.name
    clientTypeId.value = props.itemData.client_type_id

    const closeDialog = () => {
        dialogVisible.value = false;
    };

    const submitForm = async () => {
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
                showForm.value = false
            }
            else {
                const responseData = await response.json()
                apiError.value = responseData.detail
            }
        }
        catch (error) {
            console.log(error)
            apiError.value = error.message
        }
        finally {
            closeDialog()
        }
    }

    const handleSubmit = async () => {
        dialogVisible.value = true
    }

    const clientType = computed(() => {
        for (const item of props.clientTypes) {
            if (item.id === clientTypeId.value) {
                return item.name
            }
        }
    })
</script>

<template>
    <h4>Modify</h4>
    <div v-if="apiError">{{ apiError }}</div>
    <div v-if="apiMessage">{{ apiMessage }}
        Client Id: {{ clientId }}
        Client Name: {{ clientName }}
        Client Type: {{ clientType }}
    </div>
    <div v-if="props.itemType === 'Client'">Client Id: {{ clientId }}
        <form @submit.prevent="handleSubmit">
            <label for="client-name">Client Name</label>
            <input type="text" id="client-name" v-model="clientName">
            <select v-model="clientTypeId">
                <option v-for="clientType in props.clientTypes" :value="clientType.id">{{ clientType.name }}
                </option>
            </select>
            <button type="submit">Modify</button>
            <SubmitConfirm v-model:show="dialogVisible" :action-type="actionType" @confirm="submitForm"
                @cancel="closeDialog" />
        </form>
    </div>
</template>