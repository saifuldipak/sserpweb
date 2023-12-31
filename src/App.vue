<script setup>
    import { ref, onMounted } from 'vue';
    import { API_URL } from './config';
    import UserLogin from './components/UserLogin.vue';
    import ShowData from './components/ShowData.vue';
    import AddClient from './components/AddClient.vue';

    const token = ref('')
    const action = ref('')
    const clientTypes = ref([])
    const apiError = ref('')
    const data = ref()
    const searchString = ref('')
    const formType = ref('')
    const client = ref()
    const apiMessage = ref('')

    function removeToken() {
        localStorage.removeItem('token');
        token.value = ''
        action.value = ''
    }

    function updateToken() {
        token.value = localStorage.getItem('token')
        apiError.value = ''
    }

    function clickedLink(link) {
        action.value = link
        data.value = []
    }

    /* call api with different endpoint urls and return data */
    const callApi = async (apiEndpoint, method, body = '') => {
        const token = localStorage.getItem('token')
        if (!token) {
            console.log('JWT not found in local storage')
            emit('auth-required')
        }

        let request
        if (body) {
            request = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body)
            }
        }
        else {
            request = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        }

        try {
            const response = await fetch(apiEndpoint, request)
            if (response.status === 200) {
                try {
                    const data = await response.json()
                    return data
                }
                catch (jsonError) {
                    throw new Error('Error parsing json')
                }
            }
            else if (response.status === 401) {
                removeToken()
                throw new Error('Need authentication')
            }
            else {
                throw new Error(`Error: ${response.status}`)
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    onMounted(async () => {
        const apiEndpoint = API_URL + 'search/client/type'
        const method = 'GET'

        try {
            clientTypes.value = await callApi(apiEndpoint, method)
        }
        catch (error) {
            console.log(error.message)
            apiError.value = error.message
        }
    })

    const createApiEndpoint = function () {
        let apiEndpoint, clientName, clientType, servicePoint
        const method = 'GET'
        const searchStringLowerCase = searchString.value.toLowerCase()

        const clientNameRegex = /client_name:([^ ]+)/
        const clientNameMatch = clientNameRegex.exec(searchStringLowerCase)
        if (clientNameMatch) {
            clientName = clientNameMatch[1]
        }
        else {
            clientName = ''
        }

        if (action.value === 'Clients') {
            const clientTypeRegex = /client_type:([^ ]+)/
            const clientTypeMatch = clientTypeRegex.exec(searchStringLowerCase)

            if (clientTypeMatch) {
                clientType = clientTypeMatch[1]
            }
            else {
                clientType = ''
            }

            if (!clientNameMatch && !clientTypeMatch) {
                clientName = searchStringLowerCase
                clientType = ''
            }

            apiEndpoint = API_URL + `search/client?client_name=${clientName}&client_type=${clientType}`
        }
        else if (action.value === 'Services') {
            const servicePointRegex = /service_point:([^ ]+)/
            const servicePointMatch = servicePointRegex.exec(searchStringLowerCase)
            if (servicePointMatch) {
                servicePoint = servicePointMatch[1]
            }
            else {
                servicePoint = ''
            }

            if (!clientNameMatch && !servicePointMatch) {
                servicePoint = searchStringLowerCase
                clientName = ''
            }

            apiEndpoint = API_URL + `search/service?service_point=${servicePoint}&client_name=${clientName}`
        }

        return { apiEndpoint, method }
    }

    const getData = async function () {
        apiError.value = ''
        formType.value = ''
        apiMessage.value = ''
        const { apiEndpoint, method } = createApiEndpoint()

        try {
            data.value = await callApi(apiEndpoint, method)
        }
        catch (error) {
            console.log(error.message)
            apiError.value = error.message
        }
    }

    const createForm = function (form) {
        data.value = ''
        formType.value = form
    }

</script>

<template>
    <div v-if="token">
        <ul class="menu-bar">
            <li class="menu dropdown">
                <img src="./components/icons/menu_button_2.png" class="icon">
                <div class="dropdown-content">
                    <a href="#" @click="clickedLink('Clients')">Clients</a>
                    <a href="#" @click="clickedLink('Services')">Services</a>
                    <a href="#" @click="clickedLink('Contacts')">Contacts</a>
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
        <div v-if="action">
            <div class="search-bar">
                <div class="left-items">
                    <h1 class="heading">{{ action }}</h1>
                    <button class="add-button" @click="createForm('add')">+Add</button>
                </div>
                <div class="search-form">
                    <form class="search-form" @submit.prevent="getData">
                        <input class="search-input" type="text" placeholder="Enter text..." v-model="searchString"
                            required />
                        <button type="submit">Search</button>
                    </form>
                </div>
            </div>
        </div>
        <div v-if="apiError">{{ apiError }}</div>
        <div v-if="apiMessage">{{ apiMessage }}</div>
        <ShowData v-if="data" :data-type="action" :data="data" />
        <AddClient v-if="formType === 'add' && action === 'Clients'" :client-types="clientTypes" />
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
