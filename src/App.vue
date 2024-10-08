<script setup>
    import { ref, watchEffect } from "vue";
    import UserLogin from "./components/UserLogin.vue";
    //import ShowData from "./components/ShowData.vue";
    import Notification from "./components/Notification.vue";
    import Delete from "./components/Delete.vue";
    import Add from "./components/Add.vue";
    import Modify from "./components/Modify.vue";
    import ShowDetails from "./components/ShowDetails.vue";
    import Search from "./components/Search.vue";
    import HelpMessage from "./components/HelpMessage.vue";
    import Edit from "./components/Edit.vue";
    import { apiError, notification } from "./store";

    const showEdit = ref(false);
    const token = ref("");
    const itemList = ref();
    const searchString = ref();
    const showData = ref(false);
    const showDelete = ref(false);
    const itemData = ref();
    const showModify = ref(false);
    const showAdd = ref(false);
    const showNotification = ref(false);
    const itemDetails = ref();
    const itemName = ref();
    const showDetails = ref(false);
    const viewName = ref("");
    const actionName = ref("");
    const showHelpMessage = ref(false);
    const showSearch = ref(false);
    const views = ref([
        { id: 1, name: "Clients" },
        { id: 2, name: "Services" },
        { id: 3, name: "Service Types" },
        { id: 4, name: "Vendors" },
        { id: 5, name: "Pops" },
        { id: 6, name: "Addresses" },
        { id: 7, name: "Contacts" },
        { id: 8, name: "Account Managers" },
        { id: 9, name: "Client Types" },
    ]);

    const clearNotification = () => {
        notification.value.message = "";
        notification.value.type = "";
    };

    const removeToken = () => {
        localStorage.removeItem("token");
        token.value = "";
        viewName.value = "";
    };

    const updateToken = () => {
        token.value = localStorage.getItem("token");
        apiError.value = "";
        removeAllComponents();
        clearNotification();
    };

    const clickedLink = (view, searchItem) => {
        removeAllComponents();
        viewName.value = view;
        searchString.value = searchItem.toString();
        showSearch.value = true;
    };

    const getItemData = (id) => {
        for (const item of itemList.value) {
            if (item.id === id) {
                itemData.value = item;
            }
        }
    };

    const showForm = (component) => {
        removeAllComponents();
        if (component === "search") {
            showSearch.value = true;
        } else if (component === "add") {
            showAdd.value = true;
        } else if (component === "edit") {
            showEdit.value = true;
        } else if (component === "delete") {
            showDelete.value = true;
        }
    };

    const modifyItem = (itemId) => {
        getItemData(itemId);
        showData.value = false;
        actionName.value = "Modify";
        showModify.value = true;
    };

    const deleteItem = (itemId) => {
        getItemData(itemId);
        showData.value = false;
        showDelete.value = true;
    };

    const cancelDeleteItem = () => {
        showDelete.value = false;
        showData.value = true;
    };

    const viewDetails = (item, name) => {
        itemDetails.value = item;
        itemName.value = name;
        showData.value = false;
        showDetails.value = true;
    };

    const closeComponent = (component) => {
        showDetails.value = false;
        showData.value = true;
    };

    const customSearch = (view, searchItem) => {
        clickedLink(view);
        searchString.value = searchItem;
        handleSearch();
    };

    const showSearchResult = (searchResult) => {
        removeAllComponents();
        itemList.value = searchResult;
        showData.value = true;
    };

    const removeAllComponents = () => {
        showAdd.value = false;
        showEdit.value = false;
        showDelete.value = false;
        showNotification.value = false;
        showHelpMessage.value = false;
        showSearch.value = false;
        showDetails.value = false;
    };

    watchEffect(() => {
        if (apiError.value === "Unauthorized") {
            removeToken();
        }

        if (notification.value.message && notification.value.type) {
            showNotification.value = true;
        } else {
            showNotification.value = false;
        }
    });
</script>

<template>
    <div class="main-container" v-if="token">
        <ul class="menu-bar">
            <li class="menu dropdown">
                <img src="./components/icons/menu_button_2.png" class="icon" />
                <div class="dropdown-content">
                    <a href="#" v-for="view in views" :key="view.id" @click="clickedLink(view.name, '')">{{ view.name }}</a>
                </div>
            </li>
            <li class="profile dropdown">
                <img src="./components/icons/Profile-Avatar.png" class="icon" />
                <div class="dropdown-content">
                    <a href="#">Profile</a>
                    <a href="#" @click="removeToken">Logout</a>
                </div>
            </li>
        </ul>
        <div v-if="viewName" class="action-bar">
            <div class="left-items">
                <h1 class="heading">{{ viewName }}</h1>
            </div>
            <div>
                <a href="#" @click="showForm('add')"><span class="material-symbols-outlined add-button" title="add"> add_box </span></a>
                <a href="#" @click="showForm('edit')"><span class="material-symbols-outlined edit-button" title="edit">edit</span></a>
                <a href="#" @click="showForm('delete')"><span class="material-symbols-outlined delete-button" title="delete">delete</span></a>
                <a href="#" @click="showForm('search')"><span class="material-symbols-outlined" title="search"> search </span></a>
            </div>
        </div>
        <HelpMessage v-if="showHelpMessage" :view-name="viewName" @close-help-message="showHelpMessage = false" />
        <Notification v-if="showNotification" @remove-notification="showNotification = false" />
        <Add v-if="showAdd" :view-name="viewName" @show-notification="showNotification = true" @logout="removeToken" />
        <Edit v-if="showEdit" :view-name="viewName" :item-data="itemData" @show-notification="showNotification = true" />
        <Delete v-if="showDelete" :view-name="viewName" @show-notification="showNotification = true" />
        <ShowDetails
            v-if="showDetails"
            :view-name="viewName"
            :item-name="itemName"
            :item-details="itemDetails"
            @close-component="closeComponent"
            @search-item="customSearch"
        />
        <Search
            v-if="showSearch"
            :view-name="viewName"
            :search-string="searchString"
            @change-view="clickedLink"
            @show-notification="showNotification = true"
            @logout="removeToken"
        />
        <!-- <ShowData v-if="showData" :view-name="viewName" :item-list="itemList" @show-details="viewDetails" @modify-item="modifyItem" @delete-item="deleteItem" /> -->
    </div>
    <div v-else>
        <UserLogin @login-success="updateToken" />
    </div>
</template>

<style scoped>
    .main-container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    ul.menu-bar {
        width: 100%;
        list-style-type: none;
        margin: 0;
        padding: 0;
        background-color: #333;
        display: flex;
        justify-content: space-between;
        border-radius: 8px;
    }

    li.menu {
        border-radius: 8px;
    }

    .icon {
        height: 35px;
        width: 35px;
        padding: 8px;
    }

    li.menu:hover {
        background-color: rgb(87, 177, 87);
    }

    .dropdown {
        position: relative;
    }

    .dropdown-content {
        position: absolute;
        display: none;
        min-width: 130px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
        border-radius: 10px;
    }

    .profile .dropdown-content {
        right: 0;
    }

    .dropdown-content a {
        display: block;
        text-decoration: none;
        background-color: #f9f9f9;
        color: black;
        padding: 12px;
        border-radius: 10px;
    }

    .dropdown-content a:hover {
        background-color: #d7d5d5;
    }

    .dropdown:hover .dropdown-content {
        display: block;
    }

    .action-bar {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .left-items {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: left;
    }

    .left-items h1 {
        padding-right: 10px;
    }

    .right-items {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
    }

    .add-button {
        color: green;
    }

    .edit-button {
        color: orange;
    }

    .delete-button {
        color: red;
    }
</style>
