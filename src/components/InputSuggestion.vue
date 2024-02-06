<script setup>
    import { ref, watchEffect } from 'vue'
    import { createApiUrl, createRequest } from '@/functions.js'

    const message = ref('')
    const messageType = ref('')
    const itemList = ref()
    const itemName = ref('')
    const itemId = ref()

    const props = defineProps({
        itemName: {
            type: String,
            required: true
        },
        itemData: {
            type: Object
        }
    })

    const emit = defineEmits(['selectedItemId'])

    const searchSuggestions = async () => {
        message.value = ''
        messageType.value = ''

        if (itemName.value.length > 2) {
            const apiEndpoint = createApiUrl({ view: props.itemName, action: 'search', searchString: itemName.value })
            const request = createRequest('GET')

            try {
                const response = await fetch(apiEndpoint, request)
                if (response.status === 200) {
                    itemList.value = await response.json()
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
        }
    }

    const selectSuggestion = (id, name) => {
        itemId.value = id
        itemName.value = name
        itemList.value = []
        emit('selectedItemId', props.itemName, itemId.value, itemName.value)
    }

    watchEffect(() => {
        if (props.itemData) {
            selectSuggestion(props.itemData.id, props.itemData.name)
        }
    })
</script>

<template>
    <input class="client-name" type="text" :placeholder="props.itemName" v-model="itemName" @input="searchSuggestions">
    <ul v-if="itemName.length > 0" class="suggestions">
        <div v-if="props.itemName !== 'Services'">
            <li class="suggestion" v-for="item in itemList" :key="item.id" @click="selectSuggestion(item.id, item.name)">{{
                item.name }}
            </li>
        </div>
        <div v-else>
            <li class="suggestion" v-for="item in itemList" :key="item.id" @click="selectSuggestion(item.id, item.point)">{{
                item.point }}
            </li>

        </div>
    </ul>
</template>

<style scoped>
    @import "@/assets/form.css";

    .client-name {
        position: relative;
    }

    .suggestions {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .suggestions li {
        padding: 8px;
        cursor: pointer;
    }

    .suggestions li:hover {
        background-color: #f2f2f2;
    }

    /* Ensure that the suggestions dropdown is displayed above other content */
    .suggestions {
        background-color: grey;
        position: relative;
        z-index: 1000;
    }
</style>