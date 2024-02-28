<script setup>
    import { ref, watchEffect } from 'vue'
    import { notification } from '../store';

    const classObject = ref({
        info: false,
        warning: false,
        error: false
    })

    defineEmits(['removeNotification'])

    watchEffect(() => {
        if (notification.value.type === 'Info') {
            classObject.value = { info: true, warning: false, error: false }
        }
        else if (notification.value.type === 'Warning') {
            classObject.value = { info: false, warning: true, error: false }
        }
        else if (notification.value.type === 'Error') {
            classObject.value = { info: false, warning: false, error: true }

        }
    })

    const removeNotification = () => {
        notification.value.message = ''
        notification.value.type = ''
    }
</script>

<template>
    <div class="message-container">
        <div class="banner" :class="classObject">
            {{ notification.type }}
            <button @click="removeNotification">X</button>
        </div>
        <div class="message">{{ notification.message }}</div>
    </div>
</template>

<style scoped>
    .message-container {
        width: 30%;
        border: 1px solid gray;
        margin: 10px 0 10px 0;
    }

    .banner {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-bottom: 5px;
        color: white;
        font-size: large;
        padding-left: 3px;
    }

    .banner button {
        margin: 0;
        padding: 2px;
        width: 20px;
    }

    .message {
        height: 30px;
        display: flex;
        align-items: center;
        padding-left: 3px;
    }

    .info {
        background-color: rgb(4, 189, 128);
    }

    .warning {
        background-color: rgb(246, 179, 54);
    }

    .error {
        background-color: rgb(217, 87, 87);
    }
</style>