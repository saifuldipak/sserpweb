<script setup>
    import { ref, watch } from 'vue'
    import { createApiUrl, createRequest } from '@/functions.js'

    const notification = ref({
        message: '',
        type: ''
    })
    const searchString = ref('')
    const itemList = ref([])
    const props = defineProps({
        viewName: {
            type: String,
            required: true
        }
    })

    const emit = defineEmits(['showData', 'showNotification'])

    watch(props, () => {
        searchString.value = ''
    })

    const handleSearch = async () => {
        const apiEndpoint = createApiUrl({ view: props.viewName, action: 'search', searchString: searchString.value })
        const request = createRequest('GET')
        try {
            const response = await fetch(apiEndpoint, request)
            if (response.ok) {
                itemList.value = await response.json()
                emit('showData', itemList.value)
            }
            else if (response.status !== 200) {
                const responseMessage = await response.json()
                notification.value.message = responseMessage.detail
                notification.value.type = 'Error'
                emit('showNotification', notification.value, notification.type)
            }
        }
        catch (error) {
            notification.value.message = error.message
            notification.value.type = 'Error'
            emit('showNotification', notification.value, notification.type)
        }
    }
</script>

<template>
    <form class="search-form" @submit.prevent="handleSearch">
        <input class="search-input" type="text" placeholder="Enter text..." v-model="searchString" />
        <button type="submit">Search</button>
    </form>
</template>

<style>
    .search-form {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
</style>