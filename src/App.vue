<script setup>
    import { ref } from 'vue';
    import { callApi, createApiUrl, createRequest } from '@/functions.js';
    import UserLogin from './components/UserLogin.vue';
    import ShowData from './components/ShowData.vue';
    import Add from './components/Add.vue';
    import Modify from './components/Modify.vue';
    import Delete from './components/Delete.vue'

    const token = ref('')
    const clientTypes = ref()
    const apiError = ref('')
    const data = ref()
    const searchString = ref('')
    const apiMessage = ref('')
    const showData = ref(false)
    const itemType = ref('')
    const showDelete = ref(false)
    const itemData = ref()
    const showModify = ref(false)
    const showAdd = ref(false)
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
        searchString.value = ''
        showAdd.value = false
        showModify.value = false
        showDelete.value = false
        viewName.value = view
        data.value = []

        if (viewName.value === 'Service Types') {
            const method = 'GET'
            const apiEndpoint = createApiUrl({ view: viewName.value, action: 'search' })
            const request = createRequest(method)

            const { code, response, error } = await callApi(apiEndpoint, request)
            if (code === 200) {
                data.value = response
                showData.value = true
            }
            else if (code !== 200) {
                apiMessage.value = response.detail
            }
            else {
                apiError.value = error.message
            }
        }
    }

    const handleSearch = async () => {
        apiError.value = ''
        apiMessage.value = ''
        data.value = []
        showAdd.value = false
        showModify.value = false
        showDelete.value = false
        showData.value = true

        const apiEndpoint = createApiUrl({ view: viewName.value, action: 'search', searchString: searchString.value })
        const request = createRequest('GET')

        const { code, response, error } = await callApi(apiEndpoint, request)
        if (code === 200) {
            data.value = response
        }
        else if (code !== 200) {
            apiMessage.value = response.detail
        }
        else {
            apiError.value = error.message
        }
    }

    const getItemData = (id) => {
        for (const item of data.value) {
            if (item.id === id) {
                itemData.value = item
            }
        }
    }

    const addItem = async () => {
        showData.value = false
        showModify.value = false
        showDelete.value = false
        showAdd.value = true
        const request = createRequest('GET')

        let apiEndpoint
        if (viewName.value === 'Clients') {
            apiEndpoint = createApiUrl({ view: 'Client Types', action: 'search' })
        }
        else if (viewName.value === 'Services') {
            apiEndpoint = createApiUrl({ view: 'Service Types', action: 'search' })
        }
        else if (viewName.value === 'Vendors') {
            data.value = vendors.value
        }

        if (viewName.value === 'Clients' || viewName.value === 'Services') {
            const { code, response, error } = await callApi(apiEndpoint, request)
            if (code === 200) {
                data.value = response
            }
            else if (code !== 200) {
                apiMessage.value = response.detail
            }
            else {
                apiError.value = error.message
            }
        }
    }

    const modifyItem = (itemId) => {
        getItemData(itemId)
        showData.value = false
        showModify.value = true
    }

    const deleteItem = (itemId) => {
        getItemData(itemId)
        showData.value = false
        showDelete.value = true
    }

    const cancelDeleteItem = () => {
        showDeleteComponent.value = false
        showData.value = true
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
                        <input class="search-input" type="text" placeholder="Enter text..." v-model="searchString"
                            required />
                        <button type="submit">Search</button>
                    </form>
                </div>
            </div>
        </div>
        <div v-if="apiError">{{ apiError }}</div>
        <div v-if="apiMessage">{{ apiMessage }}</div>
        <ShowData v-if="showData" :view-name="viewName" :data="data" @modify-item="modifyItem" @delete-item="deleteItem" />
        <Add v-if="showAdd" :view-name="viewName" :data="data" />
        <Modify v-if="showModify" :view-name="viewName" :item-data="itemData" />
        <Delete v-if="showDelete" :view-name="viewName" :item-data="itemData" @cancel="cancelDeleteItem" />
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
