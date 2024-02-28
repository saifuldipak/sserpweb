<script setup>
    import { ref, onMounted } from 'vue'
    import { createApiUrl, createRequest, isEqualObjects } from '@/functions.js'
    import SubmitConfirm from './SubmitConfirm.vue';
    import Forms from './Forms.vue';
    import { notification } from '../store';

    const message = ref()
    const messageType = ref()
    const serviceTypes = ref([])
    const clientTypes = ref([])
    const dialogVisible = ref(false)
    const serviceData = ref({})
    const formData = ref({
        client: {
            name: '',
            client_type_id: ''
        },
        service: {
            client_id: '',
            point: '',
            service_type_id: '',
            bandwidth: '',
            pop_id: '',
            extra_info: ''
        },
        serviceTypes: {
            name: '',
            description: ''
        },
        vendor: {
            name: '',
            type: ''
        },
        pop: {
            name: '',
            owner: 0,
            extra_info: ''
        },
        address: {
            flat: '',
            floor: '',
            holding: '',
            street: '',
            area: '',
            thana: '',
            district: '',
            client_id: '',
            service_id: '',
            vendor_id: '',
            extra_info: ''
        },
        contact: {
            name: '',
            designation: '',
            type: '',
            phone1: '',
            phone2: '',
            phone3: '',
            client_id: 0,
            service_id: 0,
            vendor_id: 0
        }
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
        itemData: {
            type: Object
        }
    })

    const emit = defineEmits(['showNotification'])

    onMounted(async () => {
        message.value = ''
        messageType.value = ''

        if (props.viewName === 'Clients') {
            formData.value.client = { ...props.itemData }
        }
        else if (props.viewName === 'Services') {
            serviceData.value = { ...props.itemData }
        }

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
        dialogVisible.value = false
    }

    const handleSubmit = async () => {
        dialogVisible.value = true
    }

    const submitForm = async () => {
        let formInput, propertiesToDelete

        if (props.viewName === 'Clients') {
            formInput = formData.value.client
            propertiesToDelete = ['services', 'client_types', 'contacts', 'addresses']
        }
        else if (props.viewName === 'Services') {
            formInput = serviceData.value
            propertiesToDelete = ['service_types', 'pops', 'clients', 'contacts', 'addresses']
        }

        const result = isEqualObjects(props.itemData, formInput)
        if (result) {
            notification.value.message = 'Nothing modified'
            notification.value.type = 'Warning'
            emit('showNotification', notification.value)
            closeDialog()
            return
        }

        for (const property of propertiesToDelete) {
            delete formInput[property]
        }

        const apiEndpoint = createApiUrl({ view: props.viewName, action: props.actionName })
        const request = createRequest('PUT', formInput)

        try {
            const response = await fetch(apiEndpoint, request)

            if (response.ok) {
                notification.value.message = props.viewName + ' ' + props.actionName + ' ' + ' successful'
                notification.value.type = 'Info'
            }
            else {
                const data = await response.json()
                console.error(data)
                notification.value.message = 'API error'
                notification.value.type = 'Error'
            }
        }
        catch (error) {
            console.error(error)
            notification.value.message = error.message
            notification.value.type = 'Error'
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
                <Forms v-if="props.viewName === 'Clients'" :view-name="props.viewName" :action-name="props.actionName"
                    :client-types="clientTypes" v-model="formData" />
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