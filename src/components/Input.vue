<script setup>
    import { ref } from "vue";
    import { API_HOST } from "../config";
    import { createRequest } from "@/functions.js";
    import { notification } from "../store";

    const itemExists = ref(false);
    const props = defineProps({
        itemType: {
            type: String,
            required: true,
        },
        itemFieldName: {
            type: String,
            required: true,
        },
        placeHolder: {
            type: String,
        },
    });

    const emit = defineEmits(["showNotification", "logout", "fieldStatus"]);
    const fieldValue = defineModel();

    let timeout = null;
    const handleInput = () => {
        clearTimeout(timeout);
        if (fieldValue.length === 0) {
            itemExists.value = false;
        } else {
            timeout = setTimeout(async () => {
                await searchItem();
            }, 1500);
        }
    };

    const searchItem = async () => {
        const apiEndpoint = API_HOST + `/${props.itemType}` + `?${props.itemFieldName}=${fieldValue.value}`;
        const request = createRequest("GET");
        try {
            const response = await fetch(apiEndpoint, request);
            if (response.ok) {
                itemExists.value = true;
                emit("fieldStatus", props.itemFieldName, false);
            } else if (response.status === 404) {
                itemExists.value = false;
                emit("fieldStatus", props.itemFieldName, true);
            } else if (response.status === 401) {
                emit("logout");
            } else {
                const data = await response.json();
                throw new Error(data.detail);
            }
        } catch (error) {
            console.error(error);
            notification.value.message = error.message;
            notification.value.type = "Error";
            emit("showNotification");
        }
    };
</script>

<template>
    <input type="text" :placeholder="props.placeHolder" v-model="fieldValue" @input="handleInput" />
    <div v-if="itemExists">{{ props.placeHolder }} exists</div>
</template>
