<script setup>
    import { ref, watchEffect } from "vue";
    import { createRequest } from "@/functions.js";
    import { notification } from "../store";
    import { API_HOST } from "../config";
    import InputSuggestion from "./InputSuggestion.vue";

    const clientDetails = ref([]);
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

    const emit = defineEmits(["showNotification", "changeView"]);

    const searchItem = async (itemId, itemName) => {
        let apiEndpoint;
        accountManagers.value = [];
        if (props.viewName === "Clients") {
            apiEndpoint = API_HOST + "/clients?" + `client_id=${itemId}`;
        } else if (props.viewName === "Account Managers") {
            apiEndpoint = API_HOST + "/account_managers?" + `client_id=${itemId}`;
        }

        const request = createRequest("GET");
        try {
            const response = await fetch(apiEndpoint, request);
            if (response.ok) {
                if (props.viewName === "Clients") {
                    clientDetails.value = await response.json();
                } else if (props.viewName === "Account Managers") {
                    accountManagers.value = await response.json();
                }
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
            clientDetails.value = [];
            accountManagers.value = [];
        }

        if (props.searchString) {
            searchItem(props.searchString);
        }
    });
</script>

<template>
    <div class="form">
        <div>Search</div>
        <div class="form-fields">
            <InputSuggestion :search-item="'client name'" :view-name="props.viewName" @selected-item="searchItem" />
        </div>
    </div>
    <div v-if="clientDetails.length">
        <div>{{ clientDetails[0].name }}</div>
        <div>{{ clientDetails[0].client_types.name }}</div>
        <div v-if="clientDetails[0].account_managers.length > 0">
            <a href="#" @click="emit('changeView', 'Account Managers', clientDetails[0].id)"
                >Account Managers ({{ clientDetails[0].account_managers.length }})</a
            >
        </div>
        <div v-else>Account Managers ({{ clientDetails[0].account_managers.length }})</div>

        <!--  <div>
            <em>Addresses ({{ clientDetails[0].addresses.length }})</em>
            <ol>
                <li v-for="address in clientDetails[0].addresses" :key="address.id">{{ address.flat }}</li>
            </ol>
        </div>
        <div>
            <em>Contacts ({{ clientDetails[0].contacts.length }})</em>
            <ol>
                <li v-for="contact in clientDetails[0].contacts" :key="contact.id">{{ contact.name }}</li>
            </ol>
        </div>
        <div>
            <em>Services ({{ clientDetails[0].services.length }})</em>
            <ol>
                <li v-for="service in clientDetails[0].services" :key="service.id">{{ service.point }} ({{ service.extra_info }})</li>
            </ol>
        </div> -->
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
</style>
