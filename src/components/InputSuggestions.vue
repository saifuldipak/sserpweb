<script setup>
    import { ref, watchEffect } from "vue";
    import { useFetch } from "@/functions.js";
    import { API_HOST } from "../config";
    import { notification } from "../store";

    const message = ref("");
    const messageType = ref("");
    const itemList = ref();
    const itemName = ref("");
    const itemId = ref();

    const props = defineProps({
        placeHolder: {
            type: String,
        },
        apiResource: {
            type: Object,
            required: true,
            default: () => {
                return {
                    enpoint: "",
                    queryParameter: "",
                };
            },
        },
        inputData: {
            type: String,
        },
    });

    const emit = defineEmits(["selectedItem", "logout"]);

    let timeout = null;
    const searchSuggestions = async () => {
        message.value = "";
        clearTimeout(timeout);
        if (itemName.value.length > 2) {
            timeout = setTimeout(async () => {
                const queryString = props.apiResource.queryParameter + "=" + itemName.value;
                itemList.value = [];
                try {
                    itemList.value = await useFetch({ method: "GET", resource: props.apiResource.endpoint, queryString: queryString });
                } catch (error) {
                    if (error.message === "Not Found") {
                        message.value = " not found";
                    } else {
                        notification.value.message = error.message;
                        notification.value.type = "Error";
                    }
                }
            }, 500);
        }

        if (itemName.value.length === 0) {
            emit("selectedItem", null, null);
        }
    };

    const selectSuggestion = (id, name) => {
        itemId.value = id;
        itemName.value = name;
        itemList.value = [];
        emit("selectedItem", id, name);
    };

    watchEffect(() => {
        if (props.inputData) {
            itemName.value = props.inputData;
        }
    });
</script>

<template>
    <input class="client-name" type="text" :placeholder="`search ${props.placeHolder}`" v-model="itemName" @input="searchSuggestions" />
    <div v-if="message">{{ placeHolder + message }}</div>
    <ul v-if="itemName.length > 0" class="suggestions">
        <div v-if="props.apiResource.endpoint === '/services'">
            <li class="suggestion" v-for="item in itemList" :key="item.id" @click="selectSuggestion(item.id, item.point)">
                {{ item.point }}, {{ item.clients.name }}
            </li>
        </div>
        <div v-else-if="props.apiResource.endpoint === '/pops'">
            <li class="suggestion" v-for="item in itemList" :key="item.id" @click="selectSuggestion(item.id, item.name)">
                {{ item.name }}, {{ item.vendors.name }}
            </li>
        </div>
        <div v-else>
            <li class="suggestion" v-for="item in itemList" :key="item.id" @click="selectSuggestion(item.id, item.name)">{{ item.name }}</li>
        </div>
    </ul>
</template>

<style scoped>
    @import "@/assets/form.css";

    .client-name {
        position: relative;
    }

    .suggestions {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .suggestions li {
        padding: 8px;
        cursor: pointer;
    }

    .suggestions li:hover {
        background-color: #f2f2f2;
    }

    /* Ensure that the suggestions dropdown is displayed above other content */
    .suggestions {
        background-color: grey;
        position: relative;
        z-index: 1000;
    }
</style>
