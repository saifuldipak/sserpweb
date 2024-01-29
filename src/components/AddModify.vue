<script setup>
    import { ref, onMounted } from 'vue'
    import { createApiUrl, createRequest, selectMethod, createBody } from '@/functions.js'
    import InputFields from './InputFields.vue';
    import SubmitConfirm from './SubmitConfirm.vue';

    const message = ref()
    const messageType = ref()
    const serviceTypes = ref()
    const dialogVisible = ref(false)
    const serviceData = ref({
        id: '',
        clientId: '',
        point: '',
        serviceTypeId: '',
        bandwidth: '',
        popId: '',
        extraInfo: ''
    })
    const notification = ref({
        message: '',
        type: ''
    })


    const props = defineProps({
        viewName: {
            type: String,
            required: true
        },
        actionName: {
            type: String,
            required: true
        }
    })

    const emit = defineEmits(['showNotification'])

    onMounted(async () => {
        message.value = ''
        messageType.value = ''
        const apiEndpoint = createApiUrl({ view: 'Service Types', action: 'search' })
        const request = createRequest('GET')

        try {
            const response = await fetch(apiEndpoint, request)
            if (response.status === 200) {
                serviceTypes.value = await response.json()
            }
            else {
                const data = await response.json()
                notification.value.message = data.detail
                notification.value.type = 'Error'
            }
        }
        catch (error) {
            console.error(error)
            notification.value.message = error.message
            notification.value.type = 'Error'
        }
    })

    const closeDialog = () => {
        dialogVisible.value = false;
    };

    const handleSubmit = async () => {
        dialogVisible.value = true
    }

    const submitForm = async () => {
        let body
        if (props.viewName === 'Services') {
            body = createBody(props.viewName, props.actionName, serviceData.value)
        }
        const apiEndpoint = createApiUrl({ view: 'Services', action: props.actionName })
        const method = selectMethod(props.actionName)
        const request = createRequest(method, body)
        try {
            const response = await fetch(apiEndpoint, request)

            if (response.ok) {
                message.value = props.viewName + ' ' + props.actionName + ' ' + ' successful'
                messageType.value = 'Info'
                emit('showNotification', message.value, messageType.value)
            }
            else {
                const data = await response.json()
                console.error(data)
                message.value = 'API error'
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
</script>

<template>
    <div class="data-form">
        <form @submit.prevent="handleSubmit">
            <div class="form-fields">
                <InputFields v-if="props.viewName === 'Services'" :view-name="props.viewName"
                    :action-name="props.actionName" :service-types="serviceTypes" v-model="serviceData" />
            </div>
            <div>
                <SubmitConfirm v-model:show="dialogVisible" :action-name="props.actionName" @confirm="submitForm"
                    @cancel="closeDialog" />
            </div>
        </form>
    </div>
</template>

<style scoped>
    /* Form style */
    .data-form {
        width: 30%;
        display: flex;
        flex-direction: column;
    }

    .form-fields {
        display: flex;
        flex-direction: column;
    }

    .submit-buttons {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .form-fields input,
    select,
    button {
        box-sizing: border-box;
        width: 100%;
        display: block;
        padding: 5px;
        margin: 3px;
    }

    .form-fields button {
        margin-top: 10px;
    }
</style>