<script setup>
    import { ref, onMounted } from 'vue'
    import { createApiUrl, createRequest } from '@/functions.js'
    import SubmitConfirm from './SubmitConfirm.vue';
    import Forms from './Forms.vue'
    import { notification } from '../store';

    const serviceTypes = ref([])
    const clientTypes = ref([])
    const dialogVisible = ref(false)
    const hideMessageBox = ref(true)
    const hideFormElements = ref(false)
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

    const vendorTypes = [{
        id: 1,
        type: 'LSP'
    },
    {
        id: 2,
        type: 'ISP'
    },
    {
        id: 3,
        type: 'NTTN'
    }]

    const contactTypes = [{
        id: 1,
        type: 'Admin'
    },
    {
        id: 2,
        type: 'Technical'
    },
    {
        id: 3,
        type: 'Billing'
    }]

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


    onMounted(async () => {
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
        hideMessageBox.value = true
        hideFormElements.value = false
    };

    const handleSubmit = async () => {
        dialogVisible.value = true
        hideMessageBox.value = false
        hideFormElements.value = true
    }

    const submitForm = async () => {
        if (props.viewName === 'Addresses') {
            if (formData.value.address.client_id) {
                formData.value.address.service_id = undefined
                formData.value.address.vendor_id = undefined
            }
            else if (formData.value.address.service_id) {
                formData.value.address.client_id = undefined
                formData.value.address.vendor_id = undefined
            }
            else if (formData.value.address.vendor_id) {
                formData.value.address.client_id = undefined
                formData.value.address.service_id = undefined
            }
            else {
                notification.value.message = "You must fill one of 'Clients', 'Services' or 'Vendors'"
                notification.value.messageType = 'Warning'
                return
            }
        }

        if (props.viewName === 'Contacts') {
            if (formData.value.contact.client_id) {
                formData.value.contact.service_id = undefined
                formData.value.contact.vendor_id = undefined
            }
            else if (formData.value.contact.service_id) {
                formData.value.contact.client_id = undefined
                formData.value.contact.vendor_id = undefined
            }
            else if (formData.value.contact.vendor_id) {
                formData.value.contact.client_id = undefined
                formData.value.contact.service_id = undefined
            }
            else {
                notification.value.message = "You must fill one of 'Clients', 'Services' or 'Vendors'"
                notification.value.messageType = 'Warning'
                return
            }

            if (!formData.value.contact.phone2) {
                formData.value.contact.phone2 = undefined
            }
            if (!formData.value.contact.phone3) {
                formData.value.contact.phone3 = undefined
            }
        }

        let requestBody
        switch (props.viewName) {
            case 'Clients':
                requestBody = formData.value.client
                break;
            case 'Services':
                requestBody = formData.value.service
                break;
            case 'Service Types':
                requestBody = formData.value.serviceTypes
                break;
            case 'Vendors':
                requestBody = formData.value.vendor
                break;
            case 'Pops':
                requestBody = formData.value.pop
                break;
            case 'Addresses':
                requestBody = formData.value.address
                break;
            case 'Contacts':
                requestBody = formData.value.contact
                break;
            default:
                break;
        }

        const apiEndpoint = createApiUrl({ view: props.viewName, action: props.actionName })
        const request = createRequest('POST', requestBody)
        try {
            const response = await fetch(apiEndpoint, request)

            if (response.ok) {
                notification.value.message = props.viewName + ' ' + props.actionName + ' ' + ' successful'
                notification.value.type = 'Info'
            }
            else {
                const data = await response.json()
                console.error(data)
                notification.value.message = `API error: ${data.detail}`
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
    <div class="form">
        <div :class="{ 'form-elements-inactive': hideFormElements }">
            <form @submit.prevent="handleSubmit">
                <Forms :view-name="props.viewName" :action-name="props.actionName" :client-types="clientTypes"
                    :service-types="serviceTypes" :vendor-types="vendorTypes" :contact-types="contactTypes"
                    v-model="formData" />
                <button v-if="props.viewName !== ''" type="submit">Submit</button>
            </form>
        </div>
        <div :class="{ 'message-box': true, 'message-box-hide': hideMessageBox }">
            <SubmitConfirm v-model:show="dialogVisible" :action-name="props.actionName" @confirm="submitForm"
                @cancel="closeDialog" />
        </div>
    </div>
</template>

<style scoped>
    @import "@/assets/form.css";
</style>