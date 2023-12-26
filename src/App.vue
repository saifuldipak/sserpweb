<script setup>
    import { ref, onMounted } from 'vue';
    import { API_URL } from './config';
    import UserLogin from './components/UserLogin.vue';
    import PageHeader from './components/PageHeader.vue';
    import ShowData from './components/ShowData.vue';

    const token = ref('')
    const action = ref('')
    const clientTypes = ref([])
    const apiError = ref('')
    const data = ref([])

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
        const apiEndpoint = API_URL + 'clients/types/get'
        const method = 'GET'

        try {
            clientTypes.value = await callApi(apiEndpoint, method)
        }
        catch (error) {
            console.log(error.message)
            apiError.value = error.message
        }
    })

    const createApiEndpoint = function (viewType, searchString) {
        let apiEndpoint, method, clientName, clientType

        if (viewType === 'Clients') {
            const searchStringLowerCase = searchString.toLowerCase()
            const clientNameRegex = /client_name:([^ ]+)/
            const clientTypeRegex = /client_type:([^ ]+)/
            const clientNameMatch = clientNameRegex.exec(searchStringLowerCase)
            const clientTypeMatch = clientTypeRegex.exec(searchStringLowerCase)

            if (clientNameMatch) {
                clientName = clientNameMatch[1]
            }
            else {
                clientName = ''
            }

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
            method = 'GET'
        }

        return { apiEndpoint, method }
    }

    async function getData(viewType, searchString) {
        const { apiEndpoint, method } = createApiEndpoint(viewType, searchString)

        try {
            data.value = await callApi(apiEndpoint, method)
        }
        catch (error) {
            console.log(error.message)
            apiError.value = error.message
        }
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
        <div v-if="apiError">{{ apiError }}</div>
        <div v-if="action">
            <PageHeader @search="getData" :view-type="action" />
        </div>
        <div v-if="data">
            <ShowData :data-type="action" :data="data" />
        </div>
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
</style>                                                                                                                                                                                                                                                                                                   */
