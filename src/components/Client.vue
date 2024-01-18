<script setup>
    import { onMounted, ref } from 'vue'
    import { createApiUrl, createRequest } from '@/functions.js'
    import SubmitConfirm from './SubmitConfirm.vue';
    import SubmitButton from './SubmitButton.vue';
    import Notification from './Notification.vue';

    const apiMessage = ref('')
    const apiError = ref('')
    const clientId = ref()
    const clientName = ref('')
    const dialogVisible = ref(false)
    const clientTypeId = ref()
    const clientTypes = ref()
    const clientType = ref()
    const showDetails = ref(false)
    const showForm = ref(true)
    const message = ref('')
    const messageType = ref('')
    const hideNotification = ref(false)
    const showButton = ref(true)

    const props = defineProps({
        actionName: {
            type: String,
            required: true
        },
        itemData: {
            type: Object,
        }
    })

    const hadChanged = () => {
        if (props.itemData.name !== clientName.value) {
            return true
        }
        if (props.itemData.client_type_id !== clientTypeId.value) {
            return true
        }

        return false
    }

    const submitForm = async () => {
        if (props.actionName === 'modify') {
            const dataModified = hadChanged();
            if (!dataModified) {
                message.value = "Nothing modified"
                messageType.value = 'Warning'
                closeDialog();
                hideNotification.value = false
                return;
            }
        }


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

        hideNotification.value = false
        const request = createRequest(method, body)
        try {
            const response = await fetch(apiEndpoint, request)

            if (response.ok) {
                if (props.actionName === 'add') {
                    message.value = 'Client added'
                    messageType.value = 'Info'
                }
                else if (props.actionName === 'modify') {
                    message.value = 'Client modified'
                    messageType.value = 'Info'
                }
                else if (props.actionName === 'delete') {
                    message.value = 'Client deleted'
                    messageType.value = 'Info'
                    showDetails.value = false
                }
                showForm.value = false
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
        finally {
            closeDialog()
        }
    }

    onMounted(async () => {
        message.value = ''
        messageType.value = ''

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

        if (props.actionName === 'delete') {
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
    <h3 v-if="props.actionName === 'add'">Add Client</h3>
    <h3 v-else-if="props.actionName === 'modify'">Modify Client</h3>
    <h3 v-else-if="props.actionName === 'delete'">Delete Client</h3>
    <Notification v-if="message && !hideNotification" :message="message" :message-type="messageType"
        @hide-notification="hideNotification = true" />
    <div v-if="showDetails" class="details">
        <span>Client Id: {{ clientId }}</span>
        <span>Client Name: {{ clientName }}</span>
        <span>Client Type: {{ clientType }}</span>
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
            <div v-if="showButton">
                <SubmitButton :action-name="props.actionName" />
                <SubmitConfirm v-model:show="dialogVisible" :action-name="props.actionName" @confirm="submitForm"
                    @cancel="closeDialog" />
            </div>
        </form>
    </div>
</template>

<style scoped></style>