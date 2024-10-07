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
    });

    const emit = defineEmits(["selectedItem", "logout"]);

    const searchSuggestions = async () => {
        message.value = "";
        messageType.value = "";
        const queryString = props.apiResource.queryParameter + "=" + itemName.value;

        if (itemName.value.length > 2) {
            try {
                itemList.value = await useFetch({ method: "GET", resource: props.apiResource.endpoint, queryString: queryString });
            } catch (error) {
                notification.value.message = error.message;
                notification.value.type = "Error";
            }
        }
    };

    const selectSuggestion = (id, name) => {
        itemId.value = id;
        itemName.value = name;
        itemList.value = [];
        emit("selectedItem", props.searchItem, id, name);
    };

    watchEffect(() => {
        if (props.itemData) {
            itemName.value = props.itemData.name;
        }
        if (props.viewName) {
            itemName.value = "";
        }
    });
</script>

<template>
    <input class="client-name" type="text" :placeholder="`search ${props.placeHolder}`" v-model="itemName" @input="searchSuggestions" />
    <ul v-if="itemName.length > 0" class="suggestions">
        <div v-if="props.itemName !== 'Services'">
            <li class="suggestion" v-for="item in itemList" :key="item.id" @click="selectSuggestion(item.id, item.name)">{{ item.name }}</li>
        </div>
        <div v-else>
            <li class="suggestion" v-for="item in itemList" :key="item.id" @click="selectSuggestion(item.id, item.point)">
                {{ item.point }}, {{ item.clients.name }}
            </li>
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
