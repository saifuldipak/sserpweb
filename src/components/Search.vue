<script setup>
    import { ref, watchEffect } from "vue";
    import { createRequest } from "@/functions.js";
    import { notification } from "../store";
    import { API_HOST } from "../config";
    import InputSuggestion from "./InputSuggestion.vue";

    const clientId = ref(0);
    const clientType = ref("");
    const showSearchField = ref(false);
    const searchResult = ref([]);
    const accountManagers = ref([]);
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

    const searchItem = async () => {
        let apiEndpoint;
        accountManagers.value = [];
        if (props.viewName === "Clients") {
            apiEndpoint = API_HOST + "/clients?" + `client_id=${clientId.value}` + "&" + `client_type=${clientType.value}`;
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
    });

    const toggleSearchField = () => {
        if (showSearchField.value) {
            showSearchField.value = false;
        } else {
            showSearchField.value = true;
        }
    };

    const setItemValue = (searchItem, itemId, itemName) => {
        if (searchItem === "client name") {
            clientId.value = itemId;
        } else if (searchItem === "client type") {
            clientType.value = itemName;
        }
    };
</script>

<template>
    <div class="form">
        <div>Search</div>
        <form @submit.prevent="searchItem">
            <div class="first-search-input">
                <div class="item1">
                    <InputSuggestion :search-item="'client name'" :view-name="props.viewName" @selected-item="setItemValue" @logout="emit('logout')" />
                </div>
                <div class="item2">
                    <span class="material-symbols-outlined tooltip" title="more search options" @click="toggleSearchField">add_circle</span>
                </div>
                <div v-if="showSearchField" class="item1">
                    <InputSuggestion :search-item="'client type'" :view-name="props.viewName" @selected-item="setItemValue" />
                    <input type="submit" value="Search" />
                </div>
            </div>
        </form>
    </div>
    <div v-if="searchResult.length">
        <div v-if="searchResult.length === 1">
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
        </div>
        <div v-else-if="searchResult.length > 0">
            <ol>
                <li v-for="item in searchResult" :key="item.id">
                    <div v-if="props.viewName === 'Clients'">{{ item.name }}, {{ item.client_types.name }}</div>
                </li>
            </ol>
        </div>
    </div>
    <div v-else-if="accountManagers.length > 0">
        {{ accountManagers[0].clients.name }}
        <ol>
            <li v-for="accountManager in accountManagers" :key="accountManager.id">
                <div>{{ accountManager.contacts.name }} ({{ accountManager.contacts.type }})</div>
                <div>{{ accountManager.contacts.designation }}</div>
                <div>{{ accountManager.contacts.phone1 }}</div>
                <div>{{ accountManager.contacts.email }}</div>
            </li>
        </ol>
    </div>
</template>

<style>
    @import "@/assets/form.css";
    .first-search-input {
        display: grid;
        grid-template-columns: 6fr 1fr;
    }

    .item2 {
        display: grid;
        place-items: center;
    }

    .tooltip {
        cursor: pointer;
    }
</style>
