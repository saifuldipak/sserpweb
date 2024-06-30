<script setup>
    import { ref, onMounted } from "vue";
    import { createApiUrl, createRequest, isEqualObjects, createNotificationMessage } from "@/functions.js";
    import SubmitConfirm from "./SubmitConfirm.vue";
    import Forms from "./Forms.vue";
    import { notification, formData, vendorTypes, contactTypes } from "../store";

    const message = ref();
    const messageType = ref();
    const serviceTypes = ref([]);
    const clientTypes = ref([]);
    const dialogVisible = ref(false);
    const serviceData = ref({});
    const hideMessageBox = ref(true);
    const itemName = ref("");

    const props = defineProps({
        viewName: {
            type: String,
            required: true,
        },
        actionName: {
            type: String,
            required: true,
        },
        itemData: {
            type: Object,
        },
    });

    const emit = defineEmits(["showNotification"]);

    onMounted(async () => {
        message.value = "";
        messageType.value = "";

        if (props.viewName === "Clients") {
            formData.value.client = { ...props.itemData };
        } else if (props.viewName === "Vendors") {
            formData.value.vendor = { ...props.itemData };
        } else if (props.viewName === "Pops") {
            formData.value.pop = { ...props.itemData };
        } else if (props.viewName === "Services") {
            formData.value.service = { ...props.itemData };
        } else if (props.viewName === "Addresses") {
            formData.value.address = { ...props.itemData };
        } else if (props.viewName === "Contacts") {
            formData.value.contact = { ...props.itemData };
        }

        const request = createRequest("GET");

        let apiEndpoint;
        if (props.viewName === "Services") {
            apiEndpoint = createApiUrl({ view: "Service Types", action: "search" });
        } else if (props.viewName === "Clients") {
            apiEndpoint = createApiUrl({ view: "Client Types", action: "search" });
        }

        try {
            const response = await fetch(apiEndpoint, request);
            if (response.status === 200) {
                if (props.viewName === "Services") {
                    serviceTypes.value = await response.json();
                } else if (props.viewName === "Clients") {
                    clientTypes.value = await response.json();
                }
            } else {
                const data = await response.json();
                notification.value.message = data.detail;
                notification.value.type = "Error";
            }
        } catch (error) {
            console.error(error);
            notification.value.message = error.message;
            notification.value.type = "Error";
        }
    });

    const closeDialog = () => {
        dialogVisible.value = false;
    };

    const handleSubmit = async () => {
        dialogVisible.value = true;
        hideMessageBox.value = false;
        if (props.viewName === "Clients") {
            itemName.value = formData.value.client.name;
        } else if (props.viewName === "Services") {
            itemName.value = formData.value.service.point;
        } else if (props.viewName === "Vendors") {
            itemName.value = formData.value.vendor.name;
        } else if (props.viewName === "Pops") {
            itemName.value = formData.value.pop.name;
        } else if (props.viewName === "Addresses") {
            itemName.value = formData.value.address.flat;
        } else if (props.viewName === "Contacts") {
            itemName.value = formData.value.contact.name;
        }
    };

    const submitForm = async () => {
        let formInput, propertiesToDelete;

        if (props.viewName === "Clients") {
            formInput = formData.value.client;
            propertiesToDelete = ["services", "client_types", "contacts", "addresses"];
        } else if (props.viewName === "Vendors") {
            formInput = formData.value.vendor;
            propertiesToDelete = ["contacts", "addresses"];
        } else if (props.viewName === "Pops") {
            formInput = formData.value.pop;
            propertiesToDelete = ["vendors", "contacts", "addresses"];
        } else if (props.viewName === "Services") {
            formInput = formData.value.service;
            propertiesToDelete = ["service_types", "clients", "pops", "contacts", "addresses"];
        } else if (props.viewName === "Addresses") {
            formInput = formData.value.address;
            propertiesToDelete = ["clients", "services", "vendors", "contacts"];
        } else if (props.viewName === "Contacts") {
            formInput = formData.value.contact;
            propertiesToDelete = ["clients", "services", "vendors", "pops"];
        }

        //check if form submitted data is different than the data in the database
        const result = isEqualObjects(props.itemData, formInput);
        if (result) {
            notification.value.message = "Nothing modified";
            notification.value.type = "Warning";
            emit("showNotification", notification.value);
            closeDialog();
            return;
        }

        //remove nested properties
        for (const property of propertiesToDelete) {
            delete formInput[property];
        }

        //write data to database via API
        const apiEndpoint = createApiUrl({ view: props.viewName, action: props.actionName });
        const request = createRequest("PUT", formInput);
        try {
            const response = await fetch(apiEndpoint, request);

            if (response.ok) {
                notification.value.message = createNotificationMessage(props.viewName, props.actionName);
                notification.value.type = "Info";
                emit("showNotification");
            } else {
                const data = await response.json();
                console.error(data);
                notification.value.message = "API error";
                notification.value.type = "Error";
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
    <div class="form">
        <form @submit.prevent="handleSubmit">
            <div class="form-fields">
                <Forms
                    :view-name="props.viewName"
                    :action-name="props.actionName"
                    :client-types="clientTypes"
                    :service-types="serviceTypes"
                    :vendor-types="vendorTypes"
                    :contact-types="contactTypes"
                    v-model="formData"
                />
                <button v-if="props.viewName !== ''" type="submit">Submit</button>
            </div>
        </form>
        <SubmitConfirm v-model:show="dialogVisible" :action-name="props.actionName" :item-name="itemName" @confirm="submitForm" @cancel="closeDialog" />
    </div>
</template>

<style scoped>
    @import "@/assets/form.css";
</style>
