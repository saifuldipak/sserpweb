<script setup>
    import { ref, onMounted } from 'vue'
    import { createApiUrl, createRequest, selectMethod, createBody } from '@/functions.js'
    import SubmitConfirm from './SubmitConfirm.vue';
    import ClientForm from './ClientForm.vue';
    import ServiceForm from './ServiceForm.vue';

    const message = ref()
    const messageType = ref()
    const serviceTypes = ref([])
    const clientTypes = ref([])
    const dialogVisible = ref(false)
    const serviceData = ref({
        id: '',
        client_id: '',
        point: '',
        service_type_id: '',
        bandwidth: '',
        pop_id: '',
        extra_info: ''
    })
    const clientData = ref({
        id: '',
        name: '',
        client_type_id: ''
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
        },
    })

    const emit = defineEmits(['showNotification'])

    onMounted(async () => {
        message.value = ''
        messageType.value = ''
        const request = createRequest('GET')

        let apiEndpoint
        if (props.viewName === 'Services') {
            apiEndpoint = createApiUrl({ view: 'Service Types', action: 'search' })
        }
        else if (props.viewName === 'Clients') {
            apiEndpoint = createApiUrl({ view: 'Client Types', action: 'search' })
        }


        try {
            const response = await fetch(apiEndpoint, request)
            if (response.status === 200) {
                if (props.viewName === 'Services') {
                    serviceTypes.value = await response.json()
                }
                else if (props.viewName === 'Clients') {
                    clientTypes.value = await response.json()
                }
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
        let formData
        if (props.viewName === 'Services') {
            formData = serviceData.value
        }
        else if (props.viewName === 'Clients') {
            formData = clientData.value
        }

        const apiEndpoint = createApiUrl({ view: props.viewName, action: props.actionName })
        const request = createRequest('POST', formData)
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
                <ClientForm v-if="props.viewName === 'Clients'" :view-name="props.viewName" :action-name="props.actionName"
                    :client-types="clientTypes" v-model="clientData" />
                <ServiceForm v-if="props.viewName === 'Services'" :view-name="props.viewName"
                    :action-name="props.actionName" :service-types="serviceTypes" v-model="serviceData" />
                <button v-if="props.viewName !== ''" type="submit">Submit</button>
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