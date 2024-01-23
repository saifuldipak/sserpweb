<script setup>
    import { onMounted, ref } from 'vue'
    import { createApiUrl, createRequest } from '@/functions.js'
    import SubmitConfirm from './SubmitConfirm.vue';
    import SubmitButton from './SubmitButton.vue';
    import Notification from './Notification.vue';
    import SearchSuggestion from './SearchSuggestion.vue';


    const extraInfo = ref('')
    const popName = ref('')
    const popId = ref()
    const dialogVisible = ref(false)
    const showDetails = ref(false)
    const showForm = ref(true)
    const message = ref('')
    const messageType = ref('')
    const hideNotification = ref(false)
    const showButton = ref(true)
    const vendorId = ref()
    const searchItem = ref('Vendors')
    const popOwner = ref('')

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
        if (props.itemData.name !== popName.value) {
            return true
        }
        if (props.itemData.vendor_id !== vendorId.value) {
            return true
        }
        if (props.itemData.extra_info !== extraInfo.value) {
            return true
        }

        return false
    }

    const submitForm = async () => {
        if (props.actionName === 'modify') {
            const dataModified = hadChanged()
            if (!dataModified) {
                message.value = 'Nothing modified'
                messageType.value = 'Warning'
                closeDialog()
                hideNotification.value = false
                return
            }
        }

        let apiEndpoint = createApiUrl({ view: 'Pops', action: props.actionName })
        let body, method
        if (props.actionName === 'add') {
            method = 'POST'
            body = {
                name: popName.value,
                owner: vendorId.value,
                extra_info: extraInfo.value
            }
        }
        else if (props.actionName === 'modify') {
            method = 'PUT'
            body = {
                id: popId.value,
                name: popName.value,
                owner: vendorId.value,
                extra_info: extraInfo.value
            }
        }
        else if (props.actionName === 'delete') {
            method = 'DELETE'
            body = ''
            apiEndpoint = apiEndpoint + '/' + popId.value
        }

        hideNotification.value = false
        const request = createRequest(method, body)
        const view = 'Pop'
        try {
            const response = await fetch(apiEndpoint, request)

            if (response.ok) {
                if (props.actionName === 'add') {
                    message.value = view + ' added'
                }
                else if (props.actionName === 'modify') {
                    message.value = view + ' modified'
                }
                else if (props.actionName === 'delete') {
                    message.value = view + ' deleted'
                }
                messageType.value = 'Info'
                showDetails.value = false
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
            popId.value = props.itemData.id
            popName.value = props.itemData.name
            vendorId.value = props.itemData.owner
            extraInfo.value = props.itemData.extra_info
            popOwner.value = props.itemData.vendors.name
            showDetails.value = true
        }
    })

    const closeDialog = () => {
        dialogVisible.value = false;
    };

    const handleSubmit = async () => {
        dialogVisible.value = true
    }

    const selectedSuggesion = (selectedItemId) => {
        vendorId.value = selectedItemId
    }
</script>

<template>
    <h3 v-if="props.actionName === 'add'">Add Pop</h3>
    <h3 v-else-if="props.actionName === 'modify'">Modify Pop</h3>
    <h3 v-else-if="props.actionName === 'delete'">Delete Pop</h3>
    <Notification v-if="message && !hideNotification" :message="message" :message-type="messageType"
        @hide-notification="hideNotification = true" />
    <div class="details" v-if="showDetails">
        <span v-if="props.actionName === 'modify' || props.actionName === 'delete'">Pop Id: {{ popId }}</span>
        <span v-if="props.actionName === 'delete'">Pop Name: {{ popName }}</span>
        <span v-if="props.actionName === 'delete'">Pop owner: {{ popOwner }}</span>
    </div>
    <div class="data-form" v-if="showForm">
        <form @submit.prevent="handleSubmit">
            <div class='form-fields' v-if="props.actionName === 'add' || props.actionName === 'modify'">
                <input type="text" placeholder="pop name" v-model="popName">
                <SearchSuggestion v-if="props.actionName === 'add'" :view-name="searchItem"
                    @selected-item-id="selectedSuggesion" />
                <SearchSuggestion v-else :view-name="searchItem" :item-data="props.itemData"
                    @selected-item-id="selectedSuggesion" />
                <input type="text" placeholder="extra info" v-model="extraInfo">
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