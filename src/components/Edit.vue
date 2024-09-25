<script setup>
    import { ref, onMounted, watch } from "vue";
    import { createApiUrl, createRequest, useFetch, createNotificationMessage } from "@/functions.js";
    import { notification, formData, vendorTypes, contactTypes } from "../store";
    import InputSuggestion from "./InputSuggestion.vue";
    import { API_HOST } from "../config";
    import InputVerify from "./InputVerify.vue";
    import SubmitConfirm from "./SubmitConfirm.vue";

    const itemName = ref("");
    const searchResults = ref([]);
    const showSubmitConfirm = ref(false);
    const clientNameExists = ref(false);
    const clientId = ref(0);
    const clientName = ref("");
    const selectedClientTypeId = ref(0);
    const isDisabled = ref(true);
    const showEditForm = ref(false);
    const showSearchInput = ref(true);
    const message = ref();
    const messageType = ref();
    const serviceTypes = ref([]);
    const clientTypes = ref([]);
    const itemDetails = ref([]);

    const props = defineProps({
        viewName: {
            type: String,
            required: true,
        },
        itemData: {
            type: Object,
        },
    });

    const emit = defineEmits(["showNotification", "logout"]);

    onMounted(async () => {
        let resource;
        if (props.viewName === "Clients") {
            resource = "/client/types";
        }

        try {
            searchResults.value = await useFetch({ method: "GET", resource: resource });
        } catch (error) {
            notification.value.type = "Error";
            notification.value.message = error.message;
        }

        if (props.viewName === "Clients") {
            clientTypes.value = searchResults.value;
        }
    });

    watch(formData.value, () => {
        if (clientNameExists.value) {
            isDisabled.value = true;
        } else {
            isDisabled.value = false;
        }
    });

    const setValue = () => {
        if (props.viewName === "Clients") {
            clientId.value = itemDetails.value[0].id;
            clientName.value = itemDetails.value[0].name;
            selectedClientTypeId.value = itemDetails.value[0].client_types.id;
        }
    };

    const searchItem = async (searchItem, id, name) => {
        let resource, queryString;
        if (props.viewName === "Clients") {
            resource = "/clients";
            queryString = `client_id=${id}`;
        }

        try {
            itemDetails.value = await useFetch({ method: "GET", resource: resource, queryString: queryString });
            setValue();
            showSearchInput.value = false;
            showEditForm.value = true;
        } catch (error) {
            notification.value.type = "Error";
            notification.value.message = error.message;
        }
    };

    const processInput = (fieldInput, error) => {
        if (fieldInput) {
            if (props.viewName === "Clients") {
                formData.value.client.id = clientId.value;
                formData.value.client.name = fieldInput;
                formData.value.client.client_type_id = selectedClientTypeId.value;
                clientNameExists.value = false;
            }
        } else {
            formData.value.client.name = "";
            clientNameExists.value = true;
        }
    };

    const processSelect = () => {
        if (props.viewName === "Clients") {
            formData.value.client.id = clientId.value;
            formData.value.client.name = clientName.value;
            formData.value.client.client_type_id = selectedClientTypeId.value;
        }
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

    const submitForm = async () => {
        let resource;
        if (props.viewName === "Clients") {
            resource = "/client";
        }

        try {
            const response = await useFetch({ method: "PUT", resource: resource, requestBody: requestBody });
            notification.value.type = "Info";
            notification.value.message = createNotificationMessage(props.viewName, "Edit");
        } catch (error) {
            notification.value.type = "Error";
            notification.value.message = error.message;
        }
        closeDialog();
        emit("showNotification");
    };

    const closeDialog = () => {
        showSubmitConfirm.value = false;
    };
</script>

<template>
    <div class="form">
        Edit
        <InputSuggestion v-if="showSearchInput" :search-item="'client name'" @selected-item="searchItem" @logout="emit('logout')" />
        <form v-if="showEditForm" @submit.prevent="handleFormSubmit">
            <div v-if="props.viewName === 'Clients'">
                <InputVerify
                    :place-holder="'client name'"
                    :input-value="clientName"
                    :api-resource="{ endpoint: '/clients', queryParameter: 'client_name' }"
                    @process-input="processInput"
                />
                <div v-if="clientNameExists">Client name already exists</div>
                <select v-model="selectedClientTypeId" @change="processSelect">
                    <option disabled value="">client type</option>
                    <option v-for="clientType in clientTypes" :key="clientType.id" :value="clientType.id">
                        {{ clientType.name }}
                    </option>
                </select>
            </div>
            <input type="submit" value="Submit" :class="{ 'disable-btn': isDisabled }" />
        </form>
        <SubmitConfirm v-if="showSubmitConfirm" :action-name="'Edit'" :item-name="itemName" @confirm="submitForm" @cancel="closeDialog" />
    </div>
</template>

<style scoped>
    @import "@/assets/form.css";
    .disable-btn {
        pointer-events: none;
        opacity: 0.5;
        /* cursor: not-allowed; */
    }
</style>
