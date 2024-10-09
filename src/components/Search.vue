<script setup>
    import { onMounted, ref, watchEffect } from "vue";
    import { callApi } from "@/functions.js";
    import { notification } from "../store";
    import SearchResults from "./SearchResults.vue";
    import ShowDetails from "./ShowDetails.vue";
    import { useFetch } from "../functions";

    const optionsSelectField1 = ref([]);
    const showSelectField1 = ref(false);
    const classSelectField1 = ref("");
    const placeHolderSelectField1 = ref("");
    const selectField1 = ref("");
    const showInputField1 = ref(false);
    const classInputField1 = ref("");
    const placeHolderInputField1 = ref("");
    const inputField1 = ref("");
    const showSubmitButton = ref(true);
    const showAddButton = ref(true);
    const showSearchResults = ref(false);
    const itemDetails = ref({});
    const showDetails = ref(false);
    const serviceNameFieldClass = ref("");
    const clientTypeFieldClass = ref("");
    const clientNameFieldClass = ref("");
    const serviceName = ref("");
    const showServiceNameField = ref(false);
    const showClientNameField = ref(false);
    const showClientTypeField = ref(false);
    const clientTypesNotFound = ref(false);
    const clientName = ref("");
    const message = ref("");
    const selectedClientType = ref("");
    const clientTypes = ref([]);
    const searchResults = ref([]);
    const props = defineProps({
        viewName: {
            type: String,
            required: true,
        },
        searchString: {
            type: String,
        },
    });

    const emit = defineEmits(["showNotification", "changeView", "logout"]);

    const removeAllFields = () => {
        showSubmitButton.value = false;
        showAddButton.value = false;
        showClientNameField.value = false;
        showClientTypeField.value = false;
        showServiceNameField.value = false;
        clientName.value = "";
        serviceName.value = "";
        selectedClientType.value = "";
    };

    onMounted(async () => {
        if (props.viewName === "Clients" || props.viewName === "Client Types") {
            try {
                clientTypes.value = await callApi("GET", "/client/types");
            } catch (error) {
                if (error.message === "Not found") {
                    clientTypesNotFound.value = true;
                } else {
                    notification.value.message = error.message;
                    notification.value.type = "Error";
                    emit("showNotification");
                }
            }
        }

        /* let resource, queryString;
        if (props.viewName === "Vendors") {
            resource = "/vendors";
            queryString = `vendor_name=${inputField1.value}`;
        }

        try {
            optionsSelectField1.value = await useFetch({ method: "GET", resource: resource, queryString: queryString });
        } catch (error) {
            notification.value.type = "Error";
            notification.value.message = error.message;
        } */
    });

    watchEffect(() => {
        removeAllFields();
        searchResults.value = [];
        if (props.viewName === "Clients") {
            showClientNameField.value = true;
            clientNameFieldClass.value = "position1";
            clientTypeFieldClass.value = "position3";
        } else if (props.viewName === "Services") {
            showServiceNameField.value = true;
            serviceNameFieldClass.value = "position1";
            clientNameFieldClass.value = "position3";
        } else if (props.viewName === "Client Types") {
            showSearchResults.value = true;
            searchResults.value = clientTypes.value;
        } else if (props.viewName === "Vendors") {
            showInputField1.value = true;
            classInputField1.value = "position1";
            placeHolderInputField1.value = "vendor name";
            showAddButton.value = true;
            placeHolderSelectField1.value = "vendor type";
            optionsSelectField1.value = [
                { id: 1, name: "LSP" },
                { id: 2, name: "ISP" },
                { id: 3, name: "NTTN" },
            ];
        } else if (props.viewName === "Pops") {
            showInputField1.value = true;
            classInputField1.value = "position1";
            placeHolderInputField1.value = "pop name";
            showAddButton.value = false;
        }
    });

    const toggleField = () => {
        if (props.viewName === "Clients") {
            if (showClientTypeField.value) {
                showClientTypeField.value = false;
                selectedClientType.value = "";
            } else {
                showClientTypeField.value = true;
            }
        } else if (props.viewName === "Services") {
            if (showClientNameField.value) {
                showClientNameField.value = false;
            } else {
                showClientNameField.value = true;
            }
        } else if (props.viewName === "Vendors") {
            if (showSelectField1.value) {
                showSelectField1.value = false;
            } else {
                showSelectField1.value = true;
            }
        }
    };

    const searchItem = async () => {
        message.value = "";
        let resource, queryString;
        if (props.viewName === "Clients") {
            resource = "/clients";
            queryString = `client_name=${clientName.value}&client_type=${selectedClientType.value}`;
        } else if (props.viewName === "Vendors") {
            resource = "/vendors";
            queryString = `vendor_name=${inputField1.value}&vendor_type=${selectField1.value}`;
        } else if (props.viewName === "Pops") {
            resource = "/pops";
            queryString = `pop_name=${inputField1.value}`;
        }

        try {
            searchResults.value = await useFetch({ method: "GET", resource: resource, queryString: queryString });
            if (searchResults.value.length > 0) {
                showSearchResults.value = true;
            }
        } catch (error) {
            if (error.message === "Not Found") {
                message.value = "Nothing found";
            } else {
                notification.value.message = error.message;
                notification.value.type = "Error";
                emit("showNotification");
            }
        }
    };

    const viewDetails = (item) => {
        itemDetails.value = item;
        showSearchResults.value = false;
        showDetails.value = true;
    };

    const closeDetails = () => {
        showDetails.value = false;
        showSearchResults.value = true;
    };

    /* const handleSelect = async (apiResource, queryParameter) => {
        if (apiResource === "clients") {
            clients.value = [];
        }
        await searchItem(apiResource, queryParameter, selectedClientType.value);
    }; */

    /* 
    let timeout = null;
    const handleInput = async () => {
        clearTimeout(timeout);
        if (props.viewName === "Clients") {
            if (clientName.value || selectedClientType.value) {
            }
            timeout = setTimeout(async () => {
                await searchItem(apiEndpoint);
            }, 1500);
        }
    }; */

    /* const searchItem = async () => {
        const request = createRequest("GET");
        try {
            const response = await fetch(apiEndpoint.value, request);
            if (response.status === 200) {
                message.value = "";
                if (props.viewName === "Client Types") {
                    clientTypes.value = await response.json();
                } else if (props.viewName === "Clients") {
                    clients.value = await response.json();
                }
            } else if (response.status === 401) {
                emit("logout");
            } else if (response.status === 404) {
                message.value = "Nothing found";
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
    }; */
    /* const searchItem = async () => {
        let apiEndpoint;
        accountManagers.value = [];
        searchResult.value = [];
        if (props.viewName === "Clients") {
            apiEndpoint =
                API_HOST + "/clients?" + `client_id=${clientId.value}` + "&" + `client_type=${clientType.value}` + "&" + `page_size=${pageSize.value}`;
        } else if (props.viewName === "Account Managers") {
            apiEndpoint = API_HOST + "/account_managers?" + `client_id=${itemId}`;
        }

        const request = createRequest("GET");
        try {
            const response = await fetch(apiEndpoint, request);
            if (response.ok) {
                searchResult.value = await response.json();
                showSearchField.value = false;
            } else if (response.status === 401) {
                emit("logout");
            } else {
                const responseMessage = await response.json();
                notification.value.message = responseMessage.detail;
                notification.value.type = "Warning";
                emit("showNotification");
            }
        } catch (error) {
            notification.value.message = error.message;
            notification.value.type = "Error";
            emit("showNotification");
        }
    };

    watchEffect(() => {
        if (props.viewName) {
            searchResult.value = [];
            showSearchField.value = false;
        }

        if (props.searchString) {
            searchItem(props.searchString);
        }
    }); */

    /* const setItemValue = (searchItem, itemId, itemName) => {
        if (searchItem === "client name") {
            clientId.value = itemId;
        } else if (searchItem === "client type") {
            clientType.value = itemName;
        }
    }; */
</script>

<template>
    <!-- Search form -->
    <form class="form" @submit.prevent="searchItem">
        <div>Search</div>
        <div class="container">
            <div v-if="showInputField1" :class="classInputField1">
                <input type="text" v-model="inputField1" :placeholder="placeHolderInputField1" />
            </div>
            <div v-if="showAddButton" class="position2">
                <span class="material-symbols-outlined tooltip" title="more search options" @click="toggleField">add_circle</span>
            </div>
            <div v-if="showSelectField1" :class="classSelectField1">
                <select v-model="selectField1">
                    <option disabled value="">{{ placeHolderSelectField1 }}</option>
                    <option v-for="option in optionsSelectField1" :key="option.id" :value="option.name">
                        {{ option.name }}
                    </option>
                </select>
            </div>
            <div class="position4"><input type="submit" value="Search" /></div>

            <!-- <div v-if="showClientNameField" :class="clientNameFieldClass">
                <input type="text" v-model="clientName" placeholder="client name" />
            </div>
            <div v-if="showServiceNameField" :class="serviceNameFieldClass">
                <input type="text" v-model="serviceName" placeholder="service name" />
            </div> -->
            <!-- <div v-if="showClientTypeField" :class="clientTypeFieldClass">
                <select v-model="selectedClientType">
                    <option disabled value="">client type</option>
                    <option v-for="clientType in clientTypes" :key="clientType.id" :value="clientType.name">
                        {{ clientType.name }}
                    </option>
                </select>
                <div v-if="clientTypesNotFound">Please add client types</div>
            </div> -->
        </div>
    </form>

    <div v-if="message" class="message">{{ message }}</div>

    <SearchResults v-if="showSearchResults" :searchResults="searchResults" :viewName="props.viewName" @show-details="viewDetails" />
    <ShowDetails v-if="showDetails" :item-details="itemDetails" :viewName="props.viewName" @close="closeDetails" />

    <!-- Search results -->
    <!-- <div v-if="searchResults.length > 0">
        <ol>
            <li v-for="item in searchResults" :key="item.id">
                <div v-if="props.viewName === 'Clients'">
                    <a href="#" @click="showDetails(item.id)">{{ item.name }}, {{ item.client_types.name }}</a>
                </div>
                <div v-else>{{ item.name }}, {{ item.client_types.name }}</div>
            </li>
        </ol>
    </div> -->

    <!-- <div class="grid-container">
        <div class="item1">Item 1</div>
        <div class="item2">Item 2</div>
        <div class="item3">Item 3 (spanning only the first column)</div>
    </div> -->

    <!-- Search results -->

    <!-- <div v-if="searchResults.length">
        <div v-if="searchResults.length === 1">
            <div v-if="props.viewName === 'Clients'">
                <div>{{ searchResult[0].name }}</div>
                <div>{{ searchResult[0].client_types.name }}</div>
                <div v-if="searchResult[0].account_managers.length > 0">
                    <a href="#" @click="emit('changeView', 'Account Managers', searchResult[0].id)"
                        >Account Managers ({{ searchResult[0].account_managers.length }})</a
                    >
                </div>
                <div v-else>Account Managers ({{ searchResult[0].account_managers.length }})</div>
            </div>
        </div> -->

    <!--  <div v-if="clients.length > 0">
        <ol>
            <li v-for="client in clients" :key="client.id">
                <a href="#" @click="showDetails(client.id)">{{ client.name }}, {{ client.client_types.name }}</a>
            </li>
        </ol>
    </div>
    <div v-if="message">{{ message }}</div> -->

    <!-- <div v-if="accountManagers.length > 0">
        {{ accountManagers[0].clients.name }}
        <ol>
            <li v-for="accountManager in accountManagers" :key="accountManager.id">
                <div>{{ accountManager.contacts.name }} ({{ accountManager.contacts.type }})</div>
                <div>{{ accountManager.contacts.designation }}</div>
                <div>{{ accountManager.contacts.phone1 }}</div>
                <div>{{ accountManager.contacts.email }}</div>
            </li>
        </ol>
    </div> -->
</template>

<style>
    @import "@/assets/form.css";
    .container {
        display: grid;
        grid-template-columns: 6fr 1fr;
        /* grid-template-rows: auto auto; */
    }

    .position1 {
        grid-column: 1;
        grid-row: 1;
    }

    .position2 {
        padding: 5px;
        grid-column: 2;
        grid-row: 1;
    }

    .position3 {
        grid-column: 1;
        grid-row: 2;
    }

    .position4 {
        grid-column: 1;
        grid-row: 3;
    }

    .tooltip {
        cursor: pointer;
    }
</style>
