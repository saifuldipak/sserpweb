<script setup>
    import { ref } from 'vue';
    import SubmitConfirm from './SubmitConfirm.vue'
    import { API_URL, createRequest } from '../config';

    const dialogVisible = ref(true)
    const apiError = ref('')
    const apiMessage = ref('')
    const actionType = ref('delete')

    const props = defineProps({
        itemType: {
            type: String,
            required: true
        },
        itemData: {
            type: Object,
            required: true
        },
    })

    const emit = defineEmits(['cancel'])

    const closeDialog = (type = '') => {
        dialogVisible.value = false
        if (type) {
            emit('cancel')
        }
    };

    const deleteItem = async () => {
        apiError.value = ''
        apiMessage.value = ''

        const apiEndpoint = API_URL + 'clients/delete/' + props.itemData.id
        const method = 'DELETE'
        const request = createRequest(method)

        try {
            const response = await fetch(apiEndpoint, request)
            if (response.status === 200) {
                apiMessage.value = 'Deleted'
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
</script>

<template>
    <div v-if="apiMessage">{{ apiMessage }}</div>
    <div v-if="props.itemType === 'Client'">
        Id: {{ props.itemData.id }}
        Name: {{ props.itemData.name }}
        Type: {{ props.itemData.client_type_id }}
        <SubmitConfirm v-model:show="dialogVisible" :action-type="actionType" @confirm="deleteItem"
            @cancel="closeDialog('return')" />
    </div>
</template>