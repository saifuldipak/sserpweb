<script setup>
    import { ref } from 'vue';
    import SubmitConfirm from './SubmitConfirm.vue'
    import { createApiUrl, createRequest } from '@/functions.js';

    const dialogVisible = ref(true)
    const actionName = ref('delete')
    const notification = ref({
        message: '',
        type: ''
    })

    const props = defineProps({
        viewName: {
            type: String,
            required: true
        },
        itemData: {
            type: Object,
            required: true
        },
    })

    const emit = defineEmits(['cancel', 'showNotification'])

    const closeDialog = (type = '') => {
        dialogVisible.value = false
        if (type) {
            emit('cancel')
        }
    };

    const deleteItem = async () => {
        const apiEndpoint = createApiUrl({ view: props.viewName, action: 'delete' }) + '/' + props.itemData.id
        const method = 'DELETE'
        const request = createRequest(method)

        try {
            const response = await fetch(apiEndpoint, request)
            if (response.status === 200) {
                notification.value.message = `${props.viewName} deleted`
                notification.value.type = 'Info'
            }
            else {
                const data = await response.json()
                notification.value.message = data.detail
                notification.value.type = 'Error'
            }
        }
        catch (error) {
            console.log(error)
            notification.value.message = error.message
            notification.value.type = 'Error'
        }
        finally {
            closeDialog()
        }

        emit('showNotification', notification.value.message, notification.value.type)
    }
</script>

<template>
    <div v-if="props.viewName === 'Clients'">
        Id: {{ props.itemData.id }}
        Name: {{ props.itemData.name }}
    </div>
    <SubmitConfirm v-model:show="dialogVisible" :action-name="actionName" @confirm="deleteItem"
        @cancel="closeDialog('return')" />
</template>