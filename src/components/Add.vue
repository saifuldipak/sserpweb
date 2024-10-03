<script setup>
    import { onMounted, ref } from "vue";
    import { createRequest, resetFormData, createNotificationMessage, useFetch, checkFormInputs } from "@/functions.js";
    import SubmitConfirm from "./SubmitConfirm.vue";
    import { notification, formData } from "../store";
    import { API_HOST } from "../config";
    import InputVerify from "./InputVerify.vue";

    const optionsSelectField = ref([]);
    const selectField = ref("");
    const itemExists = ref(false);
    const showInputVerify = ref(false);
    const placeHolder = ref("");
    const endpoint = ref("");
    const queryParameter = ref("");
    const clientTypeExists = ref(false);
    const clientNameExists = ref(false);
    const showSubmitConfirm = ref(false);
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

        if (props.viewName === "Client Types") {
            placeHolder.value = "client type";
            endpoint.value = "/client/types";
            queryParameter.value = "type_name";
        } else if (props.viewName === "Vendors") {
            placeHolder.value = "vendor name";
            endpoint.value = "/vendors";
            queryParameter.value = "vendor_name";
            optionsSelectField.value = [
                { id: 1, name: "LSP" },
                { id: 2, name: "ISP" },
                { id: 3, name: "NTTN" },
            ];
        }
        showInputVerify.value = true;
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

    /* const checkFormInputs = () => {
        isDisabled.value = true;

        if (props.viewName === "Clients") {
            if (formData.value.client.name && formData.value.client.client_type_id) {
                isDisabled.value = false;
            }
        } else if (props.viewName === "Client Types") {
            if (formData.value.clientTypes.name) {
                isDisabled.value = false;
            }
        }
    }; */

    /* let timeout = null;
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
    }; */

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
        showSubmitConfirm.value = true;
    };

    /* const submitForm = async () => {
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
                showSubmitConfirm.value = false;
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
    }; */

    const submitForm = () => {
        let resource;
        if (props.viewName === "Client Types") {
            resource = "/client/type";
        } else if (props.viewName === "Vendors") {
            resource = "/vendor";
        }

        try {
            const response = useFetch({ method: "POST", resource: resource, requestBody: requestBody });
            notification.value.type = "Info";
            notification.value.message = createNotificationMessage(props.viewName, "Add");
        } catch (error) {
            notification.value.type = "Error";
            notification.value.message = error.message;
        }
        showSubmitConfirm.value = false;
        emit("showNotification");
    };

    const processInput = (fieldInput) => {
        if (fieldInput) {
            if (props.viewName === "Clients") {
                formData.value.client.name = fieldInput;
                clientNameExists.value = false;
            } else if (props.viewName === "Client Types") {
                formData.value.clientTypes.name = fieldInput;
            } else if (props.viewName === "Vendors") {
                formData.value.vendor.name = fieldInput;
            }
            itemExists.value = false;
        } else if (fieldInput === "") {
            resetFormData(formData);
            itemExists.value = false;
        } else {
            resetFormData(formData);
            itemExists.value = true;
        }

        isDisabled.value = checkFormInputs(props.viewName, formData);
    };

    const processSelect = () => {
        if (props.viewName === "Vendors") {
            formData.value.vendor.type = selectField.value;
        }

        isDisabled.value = checkFormInputs(props.viewName, formData);
    };
</script>

<template>
    <div class="form">
        Add
        <div :class="{ 'form-elements-inactive': hideFormElements }">
            <form @submit.prevent="handleFormSubmit">
                <div v-if="props.viewName === 'Clients'">
                    <InputVerify
                        :place-holder="'client name'"
                        :api-resource="{ endpoint: '/clients', queryParameter: 'client_name' }"
                        @process-input="processInput"
                    />
                    <div v-if="clientNameExists">Client exists</div>
                    <select v-model="formData.client.client_type_id" @change="checkFormInputs">
                        <option disabled value="">client type</option>
                        <option v-for="clientType in clientTypes" :key="clientType.id" :value="clientType.id">
                            {{ clientType.name }}
                        </option>
                    </select>
                    <div v-if="clientTypes.length === 0">client type not found</div>
                </div>
                <InputVerify
                    v-if="showInputVerify"
                    :place-holder="placeHolder"
                    :api-resource="{ endpoint: endpoint, queryParameter: queryParameter }"
                    @process-input="processInput"
                />
                <div v-if="itemExists">{{ placeHolder }} exists</div>
                <select v-model="selectField" @change="processSelect">
                    <option disabled value="">client type</option>
                    <option v-for="option in optionsSelectField" :key="option.id" :value="option.name">
                        {{ option.name }}
                    </option>
                </select>
                <button v-if="props.viewName !== ''" type="submit" :class="{ 'disabled-btn': isDisabled }">Submit</button>
            </form>
        </div>
        <SubmitConfirm v-if="showSubmitConfirm" :action-name="'Add'" :item-name="itemName" @confirm="submitForm" @cancel="closeDialog" />
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
