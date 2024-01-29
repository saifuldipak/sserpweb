<script setup>
    import { ref } from 'vue';
    import { callApi, createApiUrl, createRequest } from '@/functions.js';
    import UserLogin from './components/UserLogin.vue';
    import ShowData from './components/ShowData.vue';
    import Notification from './components/Notification.vue';
    import AddModify from './components/AddModify.vue';

    const token = ref('')
    const apiError = ref('')
    const data = ref()
    const searchString = ref('')
    const apiMessage = ref('')
    const showData = ref(false)
    const showDelete = ref(false)
    const itemData = ref()
    const showModify = ref(false)
    const showAdd = ref(false)
    const messageType = ref('')
    const hideNotification = ref(false)
    const showAddModify = ref(false)
    const views = ref([
        { 'id': 1, 'name': 'Clients' },
        { 'id': 2, 'name': 'Services' },
        { 'id': 3, 'name': 'Service Types' },
        { 'id': 4, 'name': 'Vendors' },
        { 'id': 5, 'name': 'Pops' },
        { id: 6, name: 'Addresses' }
    ])
    const vendors = ref([
        { id: 1, name: 'LSP' },
        { id: 2, name: 'NTTN' },
        { id: 3, name: 'ISP' }
    ])
    const viewName = ref('')
    const actionName = ref('')
    const notification = ref({
        message: '',
        type: ''
    })

    function removeToken() {
        localStorage.removeItem('token');
        token.value = ''
        viewName.value = ''
    }

    function updateToken() {
        token.value = localStorage.getItem('token')
        apiError.value = ''
    }

    async function clickedLink(view) {
        apiError.value = ''
        apiMessage.value = ''
        searchString.value = ''
        showAdd.value = false
        showModify.value = false
        showDelete.value = false
        viewName.value = view
        data.value = []
        actionName.value = ''
        hideNotification.value = true
        showAddModify.value = false
    }

    const handleSearch = async () => {
        notification.value.message = ''
        data.value = []
        actionName.value = ''
        showAdd.value = false
        showModify.value = false
        showDelete.value = false
        showData.value = true
        hideNotification.value = false
        showAddModify.value = false

        const apiEndpoint = createApiUrl({ view: viewName.value, action: 'search', searchString: searchString.value })
        const request = createRequest('GET')

        const { code, response, error } = await callApi(apiEndpoint, request)
        if (code === 200) {
            data.value = response
        }
        else if (code !== 200) {
            notification.value.message = response.detail
            notification.value.type = 'Error'
        }
        else {
            message.value = error.message
            messageType.value = 'Error'
        }
    }

    const getItemData = (id) => {
        for (const item of data.value) {
            if (item.id === id) {
                itemData.value = item
            }
        }
    }

    const addItem = () => {
        hideNotification.value = true
        showData.value = false
        actionName.value = 'add'
        showAddModify.value = true
    }

    const modifyItem = (itemId) => {
        getItemData(itemId)
        showData.value = false
        actionName.value = 'modify'
    }

    const deleteItem = (itemId) => {
        getItemData(itemId)
        showData.value = false
        showDelete.value = true
    }

    const cancelDeleteItem = () => {
        showDelete.value = false
        showData.value = true
    }

    const showNotification = (msg, type) => {
        notification.value.message = msg
        notification.value.type = type
        hideNotification.value = false
        showAddModify.value = false
        showDelete.value = false
    }
</script>

<template>
    <div v-if="token">
        <ul class="menu-bar">
            <li class="menu dropdown">
                <img src="./components/icons/menu_button_2.png" class="icon">
                <div class="dropdown-content">
                    <a href="#" v-for="view in views" :key="view.id" @click="clickedLink(view.name)">{{ view.name }}</a>
                </div>
            </li>
            <li class="profile dropdown">
                <img src="./components/icons/Profile-Avatar.png" class="icon">
                <div class="dropdown-content">
                    <a href="#">Profile</a>
                    <a href="#" @click="removeToken">Logout</a>
                </div>
            </li>
        </ul>
        <div v-if="viewName">
            <div class="search-bar">
                <div class="left-items">
                    <h1 class="heading">{{ viewName }}</h1>
                    <button class="add-button" @click="addItem">+Add</button>
                </div>
                <div class="search-form">
                    <form class="search-form" @submit.prevent="handleSearch">
                        <input class="search-input" type="text" placeholder="Enter text..." v-model="searchString" />
                        <button type="submit">Search</button>
                    </form>
                </div>
            </div>
        </div>
        <Notification v-if="notification.message && !hideNotification" :notification="notification"
            @remove-notification="hideNotification = true" />
        <ShowData v-if="showData" :view-name="viewName" :data="data" @modify-item="modifyItem" @delete-item="deleteItem" />
        <AddModify v-if="showAddModify" :view-name="viewName" :action-name="actionName"
            @show-notification="showNotification" />
    </div>
    <div v-else>
        <UserLogin @login-success="updateToken" />
    </div>
</template>

<style scoped>
    ul.menu-bar {
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

    .search-bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .left-items {
        width: 20%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: left;

    }

    .left-items h1 {
        padding-right: 10px;
    }

    .search-form {
        width: 30%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
</style>                                                                                                                                                                                                                                                                                                   */
