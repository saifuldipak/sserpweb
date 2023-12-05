<script setup>
    import { ref } from 'vue';
    import UserLogin from './components/UserLogin.vue';
    import Search from './components/Search.vue';
    import AddRecord from './components/AddRecord.vue'

    const token = ref('')
    const action = ref('')

    function removeToken() {
        localStorage.removeItem('token');
        token.value = localStorage.getItem('token')
        action.value = ''
    }

    function updateToken() {
        token.value = localStorage.getItem('token')
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
            const fetchData = await response.json()
            const data = await fetchData
            return data
        } catch (error) {
            return error.message
        }
    }

</script>

<template>
    <div v-if="token">
        <ul>
            <li class="menu dropdown">
                <img src="./components/icons/menu_button_2.png" class="icon">
                <div class="dropdown-content">
                    <a href="#" @click="clickedLink('search')">Search</a>
                    <a href="#" @click="clickedLink('Add Client')">Add Client</a>
                    <a href="#" @click="clickedLink('Add Contacts')">Add Contacts</a>
                    <a href="#" @click="clickedLink('Add Services')">Add Services</a>
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
            <div v-if="action === 'search'">
                <Search @auth-required="removeToken" />
            </div>
            <div v-else>
                <AddRecord @auth-required="removeToken" :form-type="action" />
            </div>
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
