<script setup>
    import { ref } from 'vue';
    import SubmitConfirm from './SubmitConfirm.vue'
    import { createApiUrl, createRequest } from '@/functions.js';

    const dialogVisible = ref(true)
    const actionName = ref('Delete')
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
        const apiEndpoint = createApiUrl({ view: props.viewName, action: actionName.value }) + '/' + props.itemData.id
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

        emit('showNotification', notification)
    }
</script>

<template>
    <div v-if="props.viewName === 'Clients'">
        Id: {{ props.itemData.id }}
        Name: {{ props.itemData.name }}
    </div>
    <div v-else-if="props.viewName === 'Services'">
        Id: {{ props.itemData.id }}
        Point: {{ props.itemData.point }}
        Pop: {{ props.itemData.pops.name }}
    </div>
    <div v-else-if="props.viewName === 'Service Types'">
        Id: {{ props.itemData.id }}
        Service type: {{ props.itemData.name }}
    </div>
    <div v-else-if="props.viewName === 'Vendors'">
        Id: {{ props.itemData.id }}
        Name: {{ props.itemData.name }}
        Type: {{ props.itemData.type }}
    </div>
    <div v-else-if="props.viewName === 'Pops'">
        Id: {{ props.itemData.id }}
        Name: {{ props.itemData.name }}
        Type: {{ props.itemData.vendors.name }}
    </div>
    <SubmitConfirm v-model:show="dialogVisible" :action-name="actionName" @confirm="deleteItem"
        @cancel="closeDialog('return')" />
</template>