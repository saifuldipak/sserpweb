<script setup>
    import { onMounted, ref, watchEffect } from "vue";
    import { createRequest, resetFormData, createNotificationMessage } from "@/functions.js";
    import SubmitConfirm from "./SubmitConfirm.vue";
    import { notification, formData } from "../store";
    import { API_HOST } from "../config";

    const clientNameOk = ref(false);
    const clientTypeOk = ref(false);
    const clientExists = ref(false);
    const clientTypeExists = ref(true);
    const clientTypes = ref([]);
    const clients = ref([]);
    const isDisabled = ref(true);
    const dialogVisible = ref(false);
    const hideMessageBox = ref(true);
    const hideFormElements = ref(false);
    const itemName = ref("");

    const props = defineProps({
        viewName: {
            type: String,
            required: true,
        },
    });

    const emit = defineEmits(["showNotification", "logout"]);

    onMounted(() => {
        resetFormData(formData);
    });

    const checkFormInputs = () => {
        if (props.viewName === "Clients") {
            if (clientNameOk.value && clientTypeOk.value) {
                isDisabled.value = false;
            } else {
                isDisabled.value = true;
            }
        }
    };

    let timeout = null;
    const handleInput = (apiResource) => {
        clearTimeout(timeout);

        if (apiResource === "clients" && formData.value.client.name.length === 0) {
            clientExists.value = false;
            clientNameOk.value = false;
        } else if (apiResource === "client/types" && formData.value.clientTypes.name.length === 0) {
            clientTypeExists.value = true;
            clientTypeOk.value = false;
        } else {
            timeout = setTimeout(async () => {
                await searchItem(apiResource);
                checkFormInputs();
            }, 1500);
        }
        checkFormInputs();
    };

    const searchItem = async (apiResource) => {
        let apiEndpoint;
        if (apiResource === "clients") {
            clients.value = [];
            apiEndpoint = API_HOST + `/${apiResource}` + `?client_name=${formData.value.client.name}`;
        } else if (apiResource === "client/types") {
            clientTypes.value = [];
            apiEndpoint = API_HOST + `/${apiResource}` + `?type_name=${formData.value.clientTypes.name}`;
        }

        const request = createRequest("GET");
        try {
            const response = await fetch(apiEndpoint, request);
            if (response.status === 200) {
                if (apiResource === "clients") {
                    clientExists.value = true;
                    clientNameOk.value = false;
                } else if (apiResource === "client/types") {
                    clientTypes.value = await response.json();
                    clientTypeExists.value = true;
                    clientTypeOk.value = true;
                }
            } else if (response.status === 404) {
                if (apiResource === "clients") {
                    clientExists.value = false;
                    clientNameOk.value = true;
                } else if (apiResource === "client/types") {
                    clientTypeExists.value = false;
                    clientTypeOk.value = false;
                }
            } else if (response.status === 401) {
                emit("logout");
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
            emit("showNotification");
        }
    };

    const closeDialog = () => {
        dialogVisible.value = false;
        hideMessageBox.value = true;
        hideFormElements.value = false;
    };

    let requestBody;
    const handleFormSubmit = () => {
        switch (props.viewName) {
            case "Clients":
                formData.value.client.client_type_id = clientTypes.value[0].id;
                itemName.value = formData.value.client.name;
                requestBody = formData.value.client;
                break;
            case "Services":
                itemName.value = formData.value.service.point;
                requestBody = formData.value.service;
                break;
            case "Service Types":
                itemName.value = formData.value.serviceTypes.name;
                requestBody = formData.value.serviceTypes;
                break;
            case "Vendors":
                itemName.value = formData.value.vendor.name;
                requestBody = formData.value.vendor;
                break;
            case "Pops":
                itemName.value = formData.value.pop.name;
                requestBody = formData.value.pop;
                break;
            case "Addresses":
                itemName.value = formData.value.address.flat;
                requestBody = formData.value.address;
                break;
            case "Contacts":
                itemName.value = formData.value.contact.name;
                requestBody = formData.value.contact;
                break;
            case "Account Managers":
                itemName.value = formData.value.accountManager.client_id;
                requestBody = formData.value.accountManager;
                break;
            case "Client Types":
                itemName.value = formData.value.clientTypes.name;
                requestBody = formData.value.clientTypes;
                break;
            default:
                break;
        }
        dialogVisible.value = true;
        hideMessageBox.value = false;
        hideFormElements.value = true;
    };

    const submitForm = async () => {
        let apiEndpoint;
        if (props.viewName === "Clients") {
            apiEndpoint = API_HOST + "/client";
        }

        const request = createRequest("POST", requestBody);
        try {
            const response = await fetch(apiEndpoint, request);
            if (response.ok) {
                notification.value.message = createNotificationMessage(props.viewName, "add");
                notification.value.type = "Info";
                emit("showNotification");
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

        closeDialog();
    };

    /* const submitForm = async () => {
        if (props.viewName === "Addresses") {
            if (formData.value.address.client_id) {
                formData.value.address.service_id = undefined;
                formData.value.address.vendor_id = undefined;
            } else if (formData.value.address.service_id) {
                formData.value.address.client_id = undefined;
                formData.value.address.vendor_id = undefined;
            } else if (formData.value.address.vendor_id) {
                formData.value.address.client_id = undefined;
                formData.value.address.service_id = undefined;
            } else {
                notification.value.message = "You must fill one of 'Clients', 'Services' or 'Vendors'";
                notification.value.messageType = "Warning";
                return;
            }
        }

        if (props.viewName === "Contacts") {
            if (formData.value.contact.client_id) {
                formData.value.contact.service_id = undefined;
                formData.value.contact.vendor_id = undefined;
            } else if (formData.value.contact.service_id) {
                formData.value.contact.client_id = undefined;
                formData.value.contact.vendor_id = undefined;
            } else if (formData.value.contact.vendor_id) {
                formData.value.contact.client_id = undefined;
                formData.value.contact.service_id = undefined;
            } else {
                notification.value.message = "You must fill one of 'Clients', 'Services' or 'Vendors'";
                notification.value.messageType = "Warning";
                return;
            }

            if (!formData.value.contact.phone2) {
                formData.value.contact.phone2 = undefined;
            }
            if (!formData.value.contact.phone3) {
                formData.value.contact.phone3 = undefined;
            }
        }

        const apiEndpoint = createApiUrl({ view: props.viewName, action: props.actionName });
        const request = createRequest("POST", requestBody);
        try {
            const response = await fetch(apiEndpoint, request);

            if (response.ok) {
                notification.value.message = createNotificationMessage(props.viewName, props.actionName);
                notification.value.type = "Info";
                emit("showNotification");
            } else {
                const data = await response.json();
                console.error(data);
                notification.value.message = `API error: ${data.detail}`;
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
    }; */

    /* const callApi = async (apiEndpoint, requestMethod, requestBody = "") => {
        let request;
        if (requestMethod === "GET") {
            request = createRequest(requestMethod);
        } else if (requestMethod === "POST") {
            request = createRequest(requestMethod, requestBody);
        }

        try {
            const response = await fetch(apiEndpoint, request);
            if (response.status === 200) {
                if (requestMethod === "GET") {
                    const searchResult = await response.json();
                    return searchResult;
                }
                if (requestMethod === "POST") {
                    notification.value.message = createNotificationMessage(props.viewName, "Add");
                    notification.value.type = "Info";
                    emit("showNotification");
                }
            } else if (response.status === 401) {
                emit("logout");
            } else {
                if (response.status !== 404) {
                    const data = await response.json();
                    notification.value.message = data.detail;
                    notification.value.type = "Error";
                    emit("showNotification");
                }
            }
        } catch (error) {
            console.error(error);
            notification.value.message = error.message;
            notification.value.type = "Error";
            emit("showNotification");
        }
    }; */
</script>

<template>
    <div class="form">
        Add
        <div :class="{ 'form-elements-inactive': hideFormElements }">
            <form @submit.prevent="handleFormSubmit">
                <div v-if="props.viewName === 'Clients'">
                    <input type="text" placeholder="client name" v-model="formData.client.name" @input="handleInput('clients')" />
                    <div v-if="clientExists">client exists</div>
                    <input type="text" placeholder="client type" v-model="formData.clientTypes.name" @input="handleInput('client/types')" />
                    <div v-if="!clientTypeExists">client type not found</div>
                </div>
                <button v-if="props.viewName !== ''" type="submit" :class="{ 'disabled-btn': isDisabled }">Submit</button>
            </form>
        </div>
        <SubmitConfirm v-model:show="dialogVisible" :action-name="'Add'" :item-name="itemName" @confirm="submitForm" @cancel="closeDialog" />
    </div>
</template>

<style scoped>
    @import "@/assets/form.css";
    .disabled-btn {
        pointer-events: none;
        opacity: 0.5;
        /* cursor: not-allowed; */
    }
</style>
