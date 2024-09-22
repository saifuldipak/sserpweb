<script setup>
    import { ref, onMounted, watch } from "vue";
    import { createApiUrl, createRequest } from "@/functions.js";
    import { notification, formData, vendorTypes, contactTypes } from "../store";
    import InputSuggestion from "./InputSuggestion.vue";
    import { API_HOST } from "../config";
    import InputVerify from "./InputVerify.vue";

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
        itemDetails.value = [];
        message.value = "";
        messageType.value = "";

        /*  if (props.viewName === "Clients") {
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
        } */

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

    /*  const closeDialog = () => {
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
    }; */

    /* const submitForm = async () => {
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
    }; */

    const setValue = () => {
        if (props.viewName === "Clients") {
            clientId.value = itemDetails.value[0].id;
            clientName.value = itemDetails.value[0].name;
            selectedClientTypeId.value = itemDetails.value[0].client_types.id;
        }
    };

    const searchItem = async (searchItem, id, name) => {
        let apiEndpoint;
        if (props.viewName === "Clients") {
            apiEndpoint = API_HOST + "/clients?" + `client_id=${id}`;
        }
        const request = createRequest("GET");
        try {
            const response = await fetch(apiEndpoint, request);
            if (response.ok) {
                itemDetails.value = await response.json();
                setValue();
                showSearchInput.value = false;
                showEditForm.value = true;
            } else {
                const data = await response.json();
                throw new Error(data.detail);
            }
        } catch (error) {
            console.error(error);
            notification.value.message = error.message;
            notification.value.type = "Error";
        }
    };

    /* const setItem = (searchItem, id, name) => {
        if (props.viewName === "Clients") {
            if (searchItem === "client name") {
                formData.value.client.name = name;
            }
            if (searchItem === "client type") {
                formData.value.client.client_type_id = id;
            }
        }
    }; */

    /* watchEffect(
        () => {
            if (formData.value.client.name) {
                isDisabled.value = false;
                console.log("client_name: watchEffect run");
            }
            if (formData.value.client.client_type_id) {
                isDisabled.value = false;
                console.log("client_type: watchEffect run");
            }
        },
        { flush: "post" }
    ); */

    watch(formData.value, () => {
        if (clientNameExists.value) {
            isDisabled.value = true;
        } else {
            isDisabled.value = false;
        }
    });

    const modify = () => {
        if (props.viewName === "Clients") {
            formData.value.client.id = clientId;
            formData.value.client.name = clientName;
            formData.value.client.client_type_id = selectedClientTypeId;
        }
    };

    const timeout = null;

    const handleInput = (fieldInput, apiResource, queryParameter) => {
        const valueExists = checkInput(fieldInput, apiResource, queryParameter);
        if (valueExists) {
        }
    };

    const processInput = (fieldInput, error) => {
        if (fieldInput) {
            formData.value.client.name = fieldInput;
            clientNameExists.value = false;
        } else {
            formData.value.client.name = "";
            clientNameExists.value = true;
        }
    };
</script>

<template>
    <div class="form">
        Edit
        <InputSuggestion v-if="showSearchInput" :search-item="'client name'" @selected-item="searchItem" @logout="emit('logout')" />
        <form v-if="showEditForm" @submit.prevent="handleSubmit">
            <div v-if="props.viewName === 'Clients'">
                <!-- <input type="text" v-model="clientName" @input="checkInput(clientName, 'clients', 'client_name')" /> -->
                <InputVerify
                    :place-holder="'client name'"
                    :input-value="clientName"
                    :api-resource="{ endpoint: '/clients', queryParameter: 'client_name' }"
                    @process-input="processInput"
                />
                <div v-if="clientNameExists">Client name already exists</div>
                <select v-model="selectedClientTypeId" @change="modify">
                    <option disabled value="">client type</option>
                    <option v-for="clientType in clientTypes" :key="clientType.id" :value="clientType.id">
                        {{ clientType.name }}
                    </option>
                </select>
            </div>
            <input type="submit" value="Submit" :class="{ 'disable-btn': isDisabled }" />
        </form>

        <!-- <div v-if="itemDetails.length > 0">
                <input type="text" v-model="formData.client.id" disabled />
                <input type="text" v-model="formData.client.name" />
                 <input type="text" v-model="itemDetails[0].client_types.name" />
                <InputSuggestion :search-item="'client type'" :item-data="itemDetails[0].client_types" @selected-item="searchItem" @logout="emit('logout')" />
                <input type="submit" value="Submit" />
            </div> -->
        <!-- <form @submit.prevent="handleSubmit">
            <div class="form-fields">
                <InputSuggestion
                    v-if="itemDetails.length > 0"
                    :search-item="'client type'"
                    :item-data="itemDetails[0]"
                    :selected-item="setItem"
                    :logout="emit('logout')"
                />
                <input type="submit" value="Submit" />
            </div>
        </form> -->
        <!--         <SubmitConfirm v-model:show="dialogVisible" :action-name="props.actionName" :item-name="itemName" @confirm="submitForm" @cancel="closeDialog" />-->
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
