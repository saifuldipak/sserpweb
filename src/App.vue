<script setup>
    import { ref, onMounted } from 'vue';
    import { API_URL } from './config';
    import UserLogin from './components/UserLogin.vue';
    import PageHeader from './components/PageHeader.vue';

    const token = ref('')
    const action = ref('')
    const clientTypes = ref([])
    const apiError = ref('')
    const clients = ref([])

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

    async function getData(clientName) {
        const apiEndpoint = API_URL + 'clients/search/' + clientName
        const method = 'GET'
        try {
            clients.value = await callApi(apiEndpoint, method)
        }
        catch (error) {
            console.log(error.message)
            apiError.value = error.message
        }
    }

</script>

<template>
    <div v-if="token">
        <ul>
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
            <PageHeader @get-data="getData" :view-type="action" />
        </div>
    </div>
    <div v-else>
        <UserLogin @login-success="updateToken" />
    </div>
</template>

<style scoped>
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        background-color: #333;
        display: flex;
        justify-content: space-between;
        border-radius: 8px;
    }

    li {
        border-radius: 8px;
    }

    .icon {
        height: 35px;
        width: 35px;
        padding: 8px;
    }

    li:hover {
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
