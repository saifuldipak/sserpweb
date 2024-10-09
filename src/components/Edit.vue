<script setup>
    import { ref, onMounted, watch } from "vue";
    import { createApiUrl, createRequest, useFetch, createNotificationMessage, checkFormInputs, resetFormData, createRequestBody } from "@/functions.js";
    import { notification, formData, vendorTypes, contactTypes } from "../store";
    import InputSuggestion from "./InputSuggestion.vue";
    import { API_HOST } from "../config";
    import InputVerify from "./InputVerify.vue";
    import SubmitConfirm from "./SubmitConfirm.vue";
    import InputSuggestions from "./InputSuggestions.vue";

    const popOwnerId = ref(0);
    const showInputVerify = ref(false);
    const showInputField1 = ref(false);
    const placeHolderInputField1 = ref("");
    const inputField1 = ref("");
    const showInputField2 = ref(false);
    const placeHolderInputField2 = ref("");
    const inputField2 = ref("");
    const requestBody = ref({});
    const selectOptions = ref([]);
    const itemExists = ref(false);
    const endpoint = ref("");
    const queryParameter = ref("");
    const inputField = ref("");
    const selectField = ref("");
    const vendorTypeId = ref(0);
    const placeHolder = ref("");
    const apiResource = ref({
        endpoint: "",
        queryParameter: "",
    });
    const clientTypeExists = ref(false);
    const clientTypeId = ref(0);
    const clientTypeName = ref("");
    const inputType = ref("");
    const showInputSuggestion = ref(true);
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
        resetFormData(formData);
        let resource;
        if (props.viewName === "Clients") {
            resource = "/client/types";
        }

        /* try {
            searchResults.value = await useFetch({ method: "GET", resource: resource });
        } catch (error) {
            notification.value.type = "Error";
            notification.value.message = error.message;
        }
        if (props.viewName === "Clients") {
            clientTypes.value = searchResults.value;
        } */

        if (props.viewName === "Client Types") {
            inputType.value = "client type";
        } else if (props.viewName === "Vendors") {
            apiResource.value.endpoint = "/vendors";
            apiResource.value.queryParameter = "vendor_name";
            placeHolder.value = "vendor name";
        } else if (props.viewName === "Pops") {
            apiResource.value.endpoint = "/pops";
            apiResource.value.queryParameter = "pop_name";
            placeHolder.value = "pop name";
        }
    });

    /*  watch(formData.value, () => {
        if (clientNameExists.value) {
            isDisabled.value = true;
        } else {
            isDisabled.value = false;
        }
    }); */

    /* const setValue = () => {
        if (props.viewName === "Clients") {
            clientId.value = itemDetails.value[0].id;
            clientName.value = itemDetails.value[0].name;
            selectedClientTypeId.value = itemDetails.value[0].client_types.id;
        } else if (props.viewName === "Client Types") {
            clientTypeId.value = itemDetails.value[0].id;
            clientTypeName.value = itemDetails.value[0].name;
        }
    }; */

    const createEditForm = () => {
        if (props.viewName === "Clients") {
            clientId.value = itemDetails.value[0].id;
            clientName.value = itemDetails.value[0].name;
            selectedClientTypeId.value = itemDetails.value[0].client_types.id;
        } else if (props.viewName === "Client Types") {
            clientTypeId.value = itemDetails.value[0].id;
            clientTypeName.value = itemDetails.value[0].name;
        } else if (props.viewName === "Vendors") {
            formData.value.vendor.id = itemDetails.value[0].id;
            inputField.value = itemDetails.value[0].name;
            selectField.value = itemDetails.value[0].type;
            placeHolder.value = "vendor name";
            endpoint.value = "/vendors";
            queryParameter.value = "vendor_name";
            selectOptions.value = [
                { id: 1, name: "LSP" },
                { id: 2, name: "ISP" },
                { id: 3, name: "NTTN" },
            ];
        } else if (props.viewName === "Pops") {
            formData.value.pop.id = itemDetails.value[0].id;
            inputField1.value = itemDetails.value[0].name;
            popOwnerId.value = itemDetails.value[0].owner;
            inputField2.value = itemDetails.value[0].vendors.name;
            placeHolderInputField1.value = "pop name";
            placeHolderInputField2.value = "pop owner";
            apiResource.value.endpoint = "/vendors";
            apiResource.value.queryParameter = "vendor_name";
            showInputField1.value = true;
            showInputField2.value = true;
        }

        showInputSuggestion.value = false;
        showEditForm.value = true;
    };

    const searchItem = async (id, name) => {
        if (!id) {
            return;
        }

        let resource, queryString;
        switch (props.viewName) {
            case "Clients":
                resource = "/clients";
                queryString = `client_id=${id}`;
                break;
            case "Client Types":
                resource = "/client/types";
                queryString = `type_id=${id}`;
                break;
            case "Vendors":
                resource = "/vendors";
                queryString = `vendor_id=${id}`;
                break;
            case "Pops":
                resource = "/pops";
                queryString = `pop_id=${id}`;
                break;
        }

        try {
            itemDetails.value = await useFetch({ method: "GET", resource: resource, queryString: queryString });
            createEditForm();
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
            } else if (props.viewName === "Client Types") {
                formData.value.clientTypes.id = clientTypeId.value;
                formData.value.clientTypes.name = fieldInput;
                clientTypeExists.value = false;
            } else if (props.viewName === "Vendors") {
                formData.value.vendor.id = itemDetails.value[0].id;
                formData.value.vendor.name = fieldInput;
                formData.value.vendor.type = selectField.value;
                itemExists.value = false;
            }
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
        if (props.viewName === "Clients") {
            formData.value.client.id = clientId.value;
            formData.value.client.name = clientName.value;
            formData.value.client.client_type_id = selectedClientTypeId.value;
        } else if (props.viewName === "Vendors") {
            if (selectField.value !== itemDetails.value[0].type) {
                formData.value.vendor.id = itemDetails.value[0].id;
                formData.value.vendor.name = inputField.value;
                formData.value.vendor.type = selectField.value;
            } else {
                formData.value.vendor.name = "";
                formData.value.vendor.type = "";
            }
        }

        isDisabled.value = checkFormInputs(props.viewName, formData);
    };

    const handleFormSubmit = () => {
        const [name, body] = createRequestBody(props.viewName, formData);
        itemName.value = name;
        requestBody.value = body;
        showSubmitConfirm.value = true;
    };

    const submitForm = async () => {
        closeDialog();
        let resource;
        if (props.viewName === "Clients") {
            resource = "/client";
        } else if (props.viewName === "Client Types") {
            resource = "/client/type";
        } else if (props.viewName === "Vendors") {
            resource = "/vendor";
        } else if (props.viewName === "Pops") {
            resource = "/pop";
        }

        try {
            const response = await useFetch({ method: "PUT", resource: resource, requestBody: requestBody.value });
            notification.value.type = "Info";
            notification.value.message = createNotificationMessage(props.viewName, "Edit");
        } catch (error) {
            notification.value.type = "Error";
            notification.value.message = error.message;
        }
        resetFormData(formData);
    };

    const closeDialog = () => {
        showSubmitConfirm.value = false;
    };

    const selectItem = (id, name) => {
        if (props.viewName === "Pops") {
            if (id !== popOwnerId.value) {
                formData.value.pop.owner = id;
                formData.value.pop.name = inputField1.value;
            }
        }
        isDisabled.value = checkFormInputs(props.viewName, formData);
    };

    const checkInput = () => {
        if (props.viewName === "Pops") {
            formData.value.pop.name = inputField1.value;
            formData.value.pop.owner = popOwnerId.value;
        }
        isDisabled.value = checkFormInputs(props.viewName, formData);
    };
</script>

<template>
    <div class="form">
        Edit
        <InputSuggestions v-if="showInputSuggestion" :place-holder="placeHolder" :api-resource="apiResource" @selected-item="searchItem" />
        <form v-if="showEditForm" @submit.prevent="handleFormSubmit">
            <input v-if="showInputField1" type="text" v-model="inputField1" :placeholder="placeHolderInputField1" @input="checkInput" />
            <InputSuggestions
                v-if="showInputField2"
                :input-data="inputField2"
                :place-holder="placeHolderInputField2"
                :api-resource="apiResource"
                @selected-item="selectItem"
            />

            <InputVerify
                v-if="showInputVerify"
                :place-holder="placeHolder"
                :input-value="inputField"
                :api-resource="{ endpoint: endpoint, queryParameter: queryParameter }"
                @process-input="processInput"
            />
            <div v-if="itemExists">{{ placeHolder }} exists</div>

            <select v-if="props.viewName === 'Vendors'" v-model="selectField" @change="processSelect">
                <option disabled value="">select</option>
                <option v-for="option in selectOptions" :key="option.id" :value="option.name">{{ option.name }}</option>
            </select>

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
            <div v-else-if="props.viewName === 'Client Types'">
                <InputVerify
                    :place-holder="'client type'"
                    :input-value="clientTypeName"
                    :api-resource="{ endpoint: '/client/types', queryParameter: 'type_name' }"
                    @process-input="processInput"
                />
                <div v-if="clientTypeExists">Client type already exists</div>
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
