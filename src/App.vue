<script setup>
    import { ref } from 'vue';
    import UserLogin from './components/UserLogin.vue';
    import Search from './components/Search.vue';
    import AddClient from './components/AddClient.vue'

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

</script>

<template>
    <ul v-if="token">
        <li class="menu dropdown">
            <img src="./components/icons/menu_button_2.png" class="icon">
            <div class="dropdown-content">
                <a href="#" @click="clickedLink('search')">Search</a>
                <a href="#" @click="clickedLink('add-client')">Add Client</a>
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
    <div v-else>
        <UserLogin @login-success="updateToken" />
    </div>

    <div v-if="action === 'search'">
        <Search @auth-required="removeToken" />
    </div>
    <div v-else-if="action === 'add-client'">
        <AddClient @auth-required="removeToken" />
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
