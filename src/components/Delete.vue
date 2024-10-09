<script setup>
    import { ref, onMounted, watch } from "vue";
    import { useFetch, createNotificationMessage } from "@/functions.js";
    import { notification, formData } from "../store";
    import InputSuggestions from "./InputSuggestions.vue";
    import SubmitConfirm from "./SubmitConfirm.vue";
    import ShowDetails from "./ShowDetails.vue";

    const showInputSuggestions = ref(true);
    const placeHolder = ref("");
    const endpoint = ref("");
    const queryParameter = ref("");
    const searchInput = ref("");
    const showDetailsDisable = ref(false);
    const showDetails = ref(false);
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
        if (props.viewName === "Vendors") {
            placeHolder.value = "vendor name";
            endpoint.value = "/vendors";
            queryParameter.value = "vendor_name";
        } else if (props.viewName === "Pops") {
            placeHolder.value = "pop name";
            endpoint.value = "/pops";
            queryParameter.value = "pop_name";
        }
        /* if (props.viewName === "Clients") {
            searchInput.value = "client name";
        } else if (props.viewName === "Client Types") {
            searchInput.value = "client type";
        }

        let resource;
        if (props.viewName === "Clients") {
            resource = "/client/types";
        } */

        /* try {
            searchResults.value = await useFetch({ method: "GET", resource: resource });
        } catch (error) {
            notification.value.type = "Error";
            notification.value.message = error.message;
        } */

        /* if (props.viewName === "Clients") {
            clientTypes.value = searchResults.value;
        } */
    });

    watch(formData.value, () => {
        if (clientNameExists.value) {
            isDisabled.value = true;
        } else {
            isDisabled.value = false;
        }
    });

    /* const setValue = () => {
        if (props.viewName === "Clients") {
            clientId.value = itemDetails.value[0].id;
            clientName.value = itemDetails.value[0].name;
            selectedClientTypeId.value = itemDetails.value[0].client_types.id;
        }
    }; */

    const searchItem = async (id, name) => {
        let resource, queryString;
        if (props.viewName === "Clients") {
            resource = "/clients";
            queryString = `client_id=${id}`;
        } else if (props.viewName === "Client Types") {
            resource = "/client/types";
            queryString = `type_id=${id}`;
        } else if (props.viewName === "Vendors") {
            resource = "/vendors";
            queryString = `vendor_id=${id}`;
        } else if (props.viewName === "Pops") {
            resource = "/pops";
            queryString = `pop_id=${id}`;
        }

        try {
            itemDetails.value = await useFetch({ method: "GET", resource: resource, queryString: queryString });
            showDetails.value = true;
        } catch (error) {
            notification.value.type = "Error";
            notification.value.message = error.message;
        }
    };

    /*  const processInput = (fieldInput, error) => {
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
    }; */

    /* const processSelect = () => {
        if (props.viewName === "Clients") {
            formData.value.client.id = clientId.value;
            formData.value.client.name = clientName.value;
            formData.value.client.client_type_id = selectedClientTypeId.value;
        }
    }; */

    /* let requestBody;
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
    }; */

    const deleteItem = async () => {
        showSubmitConfirm.value = false;
        let resource;
        if (props.viewName === "Clients") {
            resource = `/client/${itemDetails.value[0].id}`;
        } else if (props.viewName === "Client Types") {
            resource = `/client/type/${itemDetails.value[0].id}`;
        } else if (props.viewName === "Vendors") {
            resource = `/vendor/${itemDetails.value[0].id}`;
        } else if (props.viewName === "Pops") {
            resource = `/pop/${itemDetails.value[0].id}`;
        }

        try {
            const response = await useFetch({ method: "DELETE", resource: resource });
            notification.value.type = "Info";
            notification.value.message = createNotificationMessage(props.viewName, "Delete");
        } catch (error) {
            notification.value.type = "Error";
            notification.value.message = error.message;
        } finally {
            showDetails.value = false;
            showSubmitConfirm.value = false;
            emit("showNotification");
        }
    };

    const handleDelete = () => {
        showDetailsDisable.value = true;
        itemName.value = itemDetails.value[0].name;
        showSubmitConfirm.value = true;
    };

    const cancelSubmitConfirm = () => {
        showSubmitConfirm.value = false;
        showDetailsDisable.value = false;
    };
</script>

<template>
    <div class="form">
        Delete
        <InputSuggestions
            v-if="showInputSuggestions"
            :place-holder="placeHolder"
            :api-resource="{ endpoint: endpoint, queryParameter: queryParameter }"
            @selected-item="searchItem"
        />
    </div>
    <ShowDetails
        v-if="showDetails"
        :view-name="props.viewName"
        :item-details="itemDetails[0]"
        :show-delete-button="true"
        :disable="showDetailsDisable"
        @close="showDetails = false"
        @delete="handleDelete"
    />
    <SubmitConfirm v-if="showSubmitConfirm" :item-name="itemName" :action-name="'Delete'" @confirm="deleteItem" @cancel="cancelSubmitConfirm" />
</template>

<style scoped>
    @import "@/assets/form.css";
    .disable-btn {
        pointer-events: none;
        opacity: 0.5;
        /* cursor: not-allowed; */
    }
</style>
