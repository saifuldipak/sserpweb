<script setup>
    import { ref, watch } from "vue";
    import { createApiUrl, createRequest } from "@/functions.js";
    import { notification } from "../store";

    const searchString = ref("");
    const itemList = ref([]);
    const props = defineProps({
        viewName: {
            type: String,
            required: true,
        },
    });

    const emit = defineEmits(["showData", "showNotification", "showHelpMessage"]);

    watch(props, () => {
        searchString.value = "";
    });

    const handleSearch = async () => {
        const apiEndpoint = createApiUrl({ view: props.viewName, action: "search", searchString: searchString.value });
        const request = createRequest("GET");
        try {
            const response = await fetch(apiEndpoint, request);
            if (response.ok) {
                itemList.value = await response.json();
                emit("showData", itemList.value);
            } else {
                const responseMessage = await response.json();
                notification.value.message = responseMessage.detail;
                notification.value.type = "Error";
                itemList.value = [];
                emit("showNotification");
            }
        } catch (error) {
            notification.value.message = error.message;
            notification.value.type = "Error";
            emit("showData", itemList.value);
        }
    };
</script>

<template>
    <div class="search">
        <div class="search-box">
            <span class="material-symbols-outlined search-icon"> search </span>
            <form @submit.prevent="handleSearch">
                <input name="search-input" type="text" :placeholder="`Search ${props.viewName}`" v-model="searchString" autocomplete="on" />
            </form>
        </div>
        <a href="#" @click="$emit('showHelpMessage')"><img src="@/components/icons/help.png" title="search help" /></a>
    </div>
</template>

<style>
    .search {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
    }

    .search a {
        display: block;
        padding-left: 5px;
    }

    .help-icon {
        margin: 0;
        background-color: lightgrey;
    }

    .search-box {
        display: flex;
        flex-direction: row;
        border: 1px solid lightgrey;
        border-radius: 5px;
    }

    .search-box form {
        width: 100%;
    }

    .search-box input {
        border: none;
        width: 100px;
    }

    .search-box input:focus {
        outline: none;
    }

    .search-icon {
        background-color: lightgrey;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    @media only screen and (min-width: 768px) {
        .search-box input {
            width: 300px;
        }
    }
</style>
