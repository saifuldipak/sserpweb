<script setup>
    import { ref } from 'vue';
    import { callApi, createApiUrl, createRequest } from '@/functions.js';
    import UserLogin from './components/UserLogin.vue';
    import ShowData from './components/ShowData.vue';
    import Notification from './components/Notification.vue';
    import AddModify from './components/AddModify.vue';
    import Delete from './components/Delete.vue';
    import ClientDetails from './components/ClientDetails.vue';
    import ServiceDetails from './components/ServiceDetails.vue';
    import Add from './components/Add.vue'
    import Modify from './components/Modify.vue';

    const token = ref('')
    const apiError = ref('')
    const data = ref()
    const itemList = ref()
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
    const showClientDetails = ref(false)
    const itemDetails = ref()
    const showServiceDetails = ref(false)

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
        showData.value = false
        showAddModify.value = false
        hideNotification.value = true
        viewName.value = view
        itemList.value = []
        actionName.value = ''
    }

    const handleSearch = async () => {
        notification.value.message = ''
        itemList.value = []
        actionName.value = ''
        showAdd.value = false
        showModify.value = false
        showDelete.value = false
        showData.value = true
        hideNotification.value = false
        showAddModify.value = false
        showClientDetails.value = false
        showServiceDetails.value = false

        const apiEndpoint = createApiUrl({ view: viewName.value, action: 'search', searchString: searchString.value })
        const request = createRequest('GET')

        const { code, response, error } = await callApi(apiEndpoint, request)
        if (code === 200) {
            itemList.value = response
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
        for (const item of itemList.value) {
            if (item.id === id) {
                itemData.value = item
            }
        }
    }

    const addItem = () => {
        hideNotification.value = true
        showData.value = false
        actionName.value = 'Add'
        showAdd.value = true
    }

    const modifyItem = (itemId) => {
        getItemData(itemId)
        showData.value = false
        actionName.value = 'Modify'
        showModify.value = true
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

    const showDetails = (item) => {
        itemDetails.value = item
        showData.value = false
        if (viewName.value === 'Clients') {
            showClientDetails.value = true
        }
        else if (viewName.value === 'Services') {
            showServiceDetails.value = true
        }
    }

    const closeComponent = (component) => {
        if (component === 'ClientDetails') {
            showClientDetails.value = false
            showData.value = true
        }
        else if (component === 'ServiceDetails') {
            showServiceDetails.value = false
            showData.value = true
        }
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
        <ShowData v-if="showData" :view-name="viewName" :item-list="itemList" @show-details="showDetails"
            @modify-item="modifyItem" @delete-item="deleteItem" />
        <Add v-if="showAdd" :view-name="viewName" :action-name="actionName" :item-data="itemData"
            @show-notification="showNotification" />
        <Modify v-if="showModify" :view-name="viewName" :action-name="actionName" :item-data="itemData"
            @show-notification="showNotification" />
        <Delete v-if="showDelete" :view-name="viewName" :item-data="itemData" @cancel="cancelDeleteItem"
            @show-notification="showNotification" />
        <ClientDetails v-if="showClientDetails" :item-details="itemDetails" @close-component="closeComponent"
            @show-details="showDetails" />
        <ServiceDetails v-if="showServiceDetails" :item-details="itemDetails" @close-component="closeComponent" />
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
