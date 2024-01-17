<script setup>
    import { onMounted, ref } from 'vue'
    import { createApiUrl, createRequest } from '@/functions.js'
    import SubmitConfirm from './SubmitConfirm.vue';
    import SubmitButton from './SubmitButton.vue';

    const apiMessage = ref('')
    const apiError = ref('')
    const clientId = ref()
    const clientName = ref('')
    const dialogVisible = ref(false)
    const clientTypeId = ref()
    const clientTypes = ref()
    const clientType = ref()
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
        let apiEndpoint = createApiUrl({ view: 'Clients', action: props.actionName })
        let body, method
        if (props.actionName === 'add') {
            method = 'POST'
            body = {
                name: clientName.value,
                client_type_id: clientTypeId.value
            }
        }
        else if (props.actionName === 'modify') {
            method = 'PUT'
            body = {
                id: clientId.value,
                name: clientName.value,
                client_type_id: clientTypeId.value
            }
        }
        else if (props.actionName === 'delete') {
            method = 'DELETE'
            body = ''
            apiEndpoint = apiEndpoint + '/' + clientId.value
        }

        const request = createRequest(method, body)
        try {
            const response = await fetch(apiEndpoint, request)

            if (response.ok) {
                if (props.actionName === 'add') {
                    apiMessage.value = 'Client added'
                }
                else if (props.actionName === 'modify') {
                    apiMessage.value = 'Client modified'
                }
                else if (props.actionName === 'delete') {
                    apiMessage.value = 'Client deleted'
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

    onMounted(async () => {
        apiMessage.value = ''
        apiError.value = ''

        const apiEndpoint = createApiUrl({ view: 'Client Types', action: 'search' })
        const request = createRequest('GET')

        try {
            const response = await fetch(apiEndpoint, request)
            if (response.status === 200) {
                clientTypes.value = await response.json()
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
            clientId.value = props.itemData.id
            clientName.value = props.itemData.name
            clientTypeId.value = props.itemData.client_type_id
            clientType.value = props.itemData.client_type.name
        }

        if (props.actionName === 'add') {
            clientTypeId.value = 'comment'
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
    <h3 v-if="props.actionName === 'add'">Add Client</h3>
    <h3 v-else-if="props.actionName === 'modify'">Modify Client</h3>
    <h3 v-else-if="props.actionName === 'delete'">Delete Client</h3>
    <div v-if="apiMessage">{{ apiMessage }}</div>
    <div v-if="apiError">{{ apiError }}</div>
    <div v-if="apiMessage !== 'Client deleted'">
        <div v-if="showDetails" class="details">
            <span v-if="props.actionName === 'modify' || props.actionName === 'delete'">Client Id: {{ clientId }}</span>
            <span v-if="props.actionName === 'delete'">Client Name: {{ clientName }}</span>
            <span v-if="props.actionName === 'delete'">Clint Type: {{ clientType }}</span>
        </div>
        <div v-if="showForm" class="data-form">
            <form @submit.prevent="handleSubmit">
                <div class='form-fields' v-if="props.actionName === 'add' || props.actionName === 'modify'">
                    <input v-if="props.actionName !== 'delete'" type="text" placeholder="client name" v-model="clientName">
                    <select v-if="props.actionName !== 'delete'" v-model="clientTypeId">
                        <option value="comment" disabled>Select client type</option>
                        <option v-for="clientType in clientTypes" :value="clientType.id">{{ clientType.name }}</option>
                    </select>
                </div>
                <div class="submit-buttons">
                    <SubmitButton :action-name="props.actionName" />
                    <SubmitConfirm v-model:show="dialogVisible" :action-name="props.actionName" @confirm="submitForm"
                        @cancel="closeDialog" />
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped></style>