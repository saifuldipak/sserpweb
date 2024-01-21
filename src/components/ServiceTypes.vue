<script setup>
    import { onMounted, ref } from 'vue'
    import { createApiUrl, createRequest } from '@/functions.js'
    import SubmitConfirm from './SubmitConfirm.vue';
    import SubmitButton from './SubmitButton.vue';
    import Notification from './Notification.vue';

    const dialogVisible = ref(false)
    const showDetails = ref(false)
    const showForm = ref(true)
    const message = ref('')
    const messageType = ref('')
    const hideNotification = ref(false)
    const showButton = ref(true)
    const serviceTypeId = ref()
    const serviceType = ref('')

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
        if (props.itemData.name !== serviceType.value) {
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


        let apiEndpoint = createApiUrl({ view: 'Service Types', action: props.actionName })
        let body, method
        if (props.actionName === 'add') {
            method = 'POST'
            body = {
                name: serviceType.value,
            }
        }
        else if (props.actionName === 'modify') {
            method = 'PUT'
            body = {
                id: serviceTypeId.value,
                name: serviceType.value,
            }
        }
        else if (props.actionName === 'delete') {
            method = 'DELETE'
            body = ''
            apiEndpoint = apiEndpoint + '/' + serviceTypeId.value
        }

        hideNotification.value = false
        const request = createRequest(method, body)
        try {
            const response = await fetch(apiEndpoint, request)

            if (response.ok) {
                if (props.actionName === 'add') {
                    message.value = 'Service type added'
                    messageType.value = 'Info'
                }
                else if (props.actionName === 'modify') {
                    message.value = 'Service type modified'
                    messageType.value = 'Info'
                }
                else if (props.actionName === 'delete') {
                    message.value = 'Service type deleted'
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

        if (props.actionName === 'modify' || props.actionName === 'delete') {
            serviceTypeId.value = props.itemData.id
            serviceType.value = props.itemData.name
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
        <span>Client Id: {{ serviceTypeId }}</span>
        <span>Client Name: {{ serviceType }}</span>
    </div>
    <div v-if="showForm" class="data-form">
        <form @submit.prevent="handleSubmit">
            <div class='form-fields' v-if="props.actionName === 'add' || props.actionName === 'modify'">
                <input v-if="props.actionName !== 'delete'" type="text" placeholder="service type" v-model="serviceType">
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