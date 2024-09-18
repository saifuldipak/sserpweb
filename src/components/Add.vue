<script setup>
    import { onMounted, ref } from "vue";
    import { createRequest, resetFormData, createNotificationMessage } from "@/functions.js";
    import SubmitConfirm from "./SubmitConfirm.vue";
    import { notification, formData } from "../store";
    import { API_HOST } from "../config";

    const clientName = ref("");
    const fieldInput = ref("");
    const clientTypes = ref([]);
    const clients = ref("");
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
        searchItem("client/types");
    });

    const checkClientName = () => {
        if (clients.value) {
            clientName.value = "";
            for (const client of clients.value) {
                if (client.name === fieldInput.value) {
                    clientName.value = client.name;
                    break;
                }
            }
            if (!clientName.value) {
                formData.value.client.name = fieldInput.value;
            } else {
                formData.value.client.name = "";
            }
        }
    };

    const checkFormInputs = () => {
        if (props.viewName === "Clients") {
            if (formData.value.client.name && formData.value.client.client_type_id) {
                isDisabled.value = false;
            } else {
                isDisabled.value = true;
            }
        }
    };

    let timeout = null;
    const handleInput = (apiResource, queryParameter) => {
        clearTimeout(timeout);
        if (fieldInput.value.length > 0) {
            timeout = setTimeout(async () => {
                await searchItem(apiResource, queryParameter, fieldInput.value);
                checkClientName();
                checkFormInputs();
            }, 1500);
        } else {
            clientName.value = "";
            formData.value.client.name = "";
            checkFormInputs();
        }
    };

    const searchItem = async (apiResource, queryParameter = "", queryValue = "") => {
        let apiEndpoint;
        if (queryParameter && queryValue) {
            apiEndpoint = API_HOST + `/${apiResource}?${queryParameter}=${queryValue}`;
        } else {
            apiEndpoint = API_HOST + `/${apiResource}`;
        }

        const request = createRequest("GET");
        try {
            const response = await fetch(apiEndpoint, request);
            if (response.status === 200) {
                if (apiResource === "client/types") {
                    clientTypes.value = await response.json();
                } else if (apiResource === "clients") {
                    clients.value = await response.json();
                }
            } else if (response.status === 404) {
                if (apiResource === "clients") {
                    formData.value.client.name = fieldInput.value;
                }
            } else if (response.status === 401) {
                emit("logout");
            } else {
                if (response.status !== 404) {
                    const data = await response.json();
                    throw new Error(data.detail);
                }
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
                notification.value.message = createNotificationMessage(props.viewName, "Add");
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
                    <input type="text" placeholder="client name" v-model="fieldInput" @input="handleInput('clients', 'client_name')" />
                    <div v-if="clientName.length > 0">client exists</div>
                    <select v-model="formData.client.client_type_id" @change="checkFormInputs">
                        <option disabled value="">client type</option>
                        <option v-for="clientType in clientTypes" :key="clientType.id" :value="clientType.id">
                            {{ clientType.name }}
                        </option>
                    </select>
                    <div v-if="clientTypes.length === 0">client type not found</div>
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
