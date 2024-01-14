<script setup>
    import { computed, onMounted, ref } from 'vue'
    import { createApiUrl, createRequest } from '@/functions.js';
    import SubmitConfirm from './SubmitConfirm.vue'

    const clientId = ref()
    const clientName = ref('')
    const clientTypeId = ref()
    const apiMessage = ref('')
    const apiError = ref('')
    const dialogVisible = ref(false);
    const showForm = ref(true)
    const actionType = ref('modify')
    const clientTypes = ref()

    const props = defineProps({
        itemData: Object,
        viewName: String,
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

        const apiEndpoint = createApiUrl({ view: 'Clients', action: 'modify' })
        const method = 'PUT'
        const body = { id: clientId.value, name: clientName.value, client_type_id: clientTypeId.value }
        const request = createRequest(method, body)

        try {
            const response = await fetch(apiEndpoint, request)
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

    onMounted(async () => {
        if (props.viewName === 'Clients') {
            await getClientTypes()
        }
    })

    const getClientTypes = async () => {
        if (!clientTypes.value) {
            const request = createRequest('GET')
            const apiEndpoint = createApiUrl({ view: 'Client Types', action: 'search' })

            try {
                const response = await fetch(apiEndpoint, request)
                const data = await response.json()
                if (response.status === 200) {
                    clientTypes.value = data
                }
                else {
                    apiMessage.value = data.detail
                }
            }
            catch (error) {
                console.error = error
                apiError.value = error.message
            }
        }
    }

    const clientTypeName = computed(() => {
        for (const clientType of clientTypes.value) {
            if (clientType.id === clientTypeId.value) {
                return clientType.name
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
        Client Type: {{ clientTypeName }}
    </div>
    <div v-if="props.viewName === 'Clients'">Client Id: {{ clientId }}
        <form @submit.prevent="handleSubmit">
            <label for="client-name">Client Name</label>
            <input type="text" id="client-name" v-model="clientName">
            <select v-model="clientTypeId">
                <option v-for="clientType in clientTypes" :value="clientType.id">{{ clientType.name }}
                </option>
            </select>
            <button type="submit">Modify</button>
            <SubmitConfirm v-model:show="dialogVisible" :action-type="actionType" @confirm="submitForm"
                @cancel="closeDialog" />
        </form>
    </div>
</template>