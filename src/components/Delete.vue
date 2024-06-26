<script setup>
    import { ref } from "vue";
    import SubmitConfirm from "./SubmitConfirm.vue";
    import { createApiUrl, createRequest, createNotificationMessage } from "@/functions.js";
    import { notification } from "../store";

    const dialogVisible = ref(true);
    const actionName = ref("Delete");
    const hideMessageBox = ref(false);

    const props = defineProps({
        viewName: {
            type: String,
            required: true,
        },
        itemData: {
            type: Object,
            required: true,
        },
    });

    const emit = defineEmits(["cancel", "showNotification"]);

    const closeDialog = (type = "") => {
        dialogVisible.value = false;
        if (type) {
            emit("cancel");
        }
    };

    const deleteItem = async () => {
        const apiEndpoint = createApiUrl({ view: props.viewName, action: actionName.value }) + "/" + props.itemData.id;
        const method = "DELETE";
        const request = createRequest(method);

        try {
            const response = await fetch(apiEndpoint, request);
            if (response.status === 200) {
                notification.value.message = createNotificationMessage(props.viewName, actionName.value);
                notification.value.type = "Info";
                emit("showNotification");
            } else {
                const data = await response.json();
                notification.value.message = data.detail;
                notification.value.type = "Error";
                emit("showNotification");
            }
        } catch (error) {
            console.error(error);
            notification.value.message = error.message;
            notification.value.type = "Error";
        } finally {
            closeDialog();
        }
    };
</script>

<template>
    <div class="message-box-container">
        <SubmitConfirm
            v-model:show="dialogVisible"
            :action-name="actionName"
            :item-name="props.itemData.name"
            @confirm="deleteItem"
            @cancel="closeDialog('return')"
        />
    </div>
</template>

<style scoped>
    .message-box-container {
        width: 30%;
        position: relative;
    }
</style>
