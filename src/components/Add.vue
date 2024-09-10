<script setup>
    import { ref, onMounted } from "vue";
    import { createApiUrl, createRequest, createNotificationMessage, resetFormData } from "@/functions.js";
    import SubmitConfirm from "./SubmitConfirm.vue";
    import { notification, formData } from "../store";
    import { API_HOST } from "../config";

    const clients = ref([]);
    const isDisabled = ref(true);
    const serviceTypes = ref([]);
    const clientTypes = ref([]);
    const dialogVisible = ref(false);
    const hideMessageBox = ref(true);
    const hideFormElements = ref(false);
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
    });

    const emit = defineEmits(["showNotification"]);

    onMounted(async () => {
        resetFormData(formData.value);

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
        hideMessageBox.value = true;
        hideFormElements.value = false;
    };

    let requestBody;
    const handleSubmit = async () => {
        switch (props.viewName) {
            case "Clients":
                formData.value.client.client_type_id = formData.value.clientTypes.id;
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

    const callApi = async (apiEndpoint, requestMethod, requestBody = "") => {
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
    };

    const checkFormInputs = () => {
        if (props.viewName === "Clients") {
            if (formData.value.client.name && formData.value.clientTypes.name) {
                isDisabled.value = false;
            } else {
                isDisabled.value = true;
            }
        }
    };

    let timeout = null;
    const handleInput = (apiResource) => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            searchItem(apiResource);
        }, 2500);

        checkFormInputs();
    };

    const searchItem = async (apiResource) => {
        searchResult.value = [];
        let apiEndpoint;
        if (apiResource === "clients") {
            apiEndpoint = API_HOST + `/${apiResource}` + `?client_name=${formData.value.client.name}`;
            clients.value = callApi(apiEndpoint, "GET");
        } else if (apiResource === "client/types") {
            apiEndpoint = API_HOST + `/${apiResource}` + `?type_name=${formData.value.clientTypes.name}`;
            clientTypes.value = callApi(apiEndpoint, "GET");
        }
    };

    const setSuggestionValue = (searchItem, itemId, itemName) => {
        if (searchItem === "client type") {
            formData.value.client.client_type_id = itemId;
        }
        checkFormInputs();
    };

    const submitForm = () => {
        let apiEndpoint;
        if (props.viewName === "Clients") {
            apiEndpoint = API_HOST + "/client";
            callApi(apiEndpoint, "POST", requestBody);
        }
        closeDialog();
    };
</script>

<template>
    <div class="form">
        Add
        <div :class="{ 'form-elements-inactive': hideFormElements }">
            <form @submit.prevent="handleSubmit">
                <div v-if="props.viewName === 'Clients'">
                    <input type="text" placeholder="client name" v-model="formData.client.name" @input="handleInput('clients')" />
                    <div v-if="clients.length > 0">client exists</div>
                    <input type="text" placeholder="client type" v-model="formData.clientTypes.name" @input="handleInput('client/types')" />
                    <div v-if="clientTypes.length === 0">client type not found</div>
                    <!-- <InputSuggestion :view-name="props.viewName" :search-item="'client type'" @selected-item="setSuggestionValue" /> -->
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
