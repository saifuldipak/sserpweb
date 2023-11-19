<script setup>
    import { ref } from 'vue';
    import UserLogin from './components/UserLogin.vue';
    import Search from './components/Search.vue';
    import AddRecord from './components/AddRecord.vue';

    const token = ref('')
    const action = ref('')

    function removeToken() {
        localStorage.removeItem('token');
        token.value = localStorage.getItem('token')
    }

    function updateToken() {
        token.value = localStorage.getItem('token')
    }

    function clickedLink(link) {
        action.value = link
    }

</script>

<template>
    <div v-if="token">
        <nav>
            <ul>
                <li class="dropdown">
                    <img src="./components/icons/menu_button_2.png">
                    <div class="dropdown-content">
                        <a href="#" @click="clickedLink('search')">Search</a>
                        <a href="#" @click="clickedLink('add-client')">Add Client</a>
                    </div>
                </li>
                <li class="logout"><img src="./components/icons/Profile-Avatar.png">saiful</li>
            </ul>
        </nav>
        <div v-if="action === 'search'">
            <Search @auth-required="removeToken" />
        </div>
        <div v-else-if="action === 'add-client'">
            <AddRecord @auth-required="removeToken" />
        </div>
    </div>
    <div v-else>
        <UserLogin @login-success="updateToken" />
    </div>
</template>

<style scoped>
    nav {
        background-color: #2a2a2a;
        color: #fff;
        text-align: center;
    }

    nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: space-between;

    }

    nav li {
        padding: 15px;
        background-color: rgb(26, 182, 86);
    }

    li img {
        height: 35px;
        width: 35px;
    }

    li a {
        color: #f3f5f3;
        text-decoration: none;
    }

    li.logout {
        display: flex;
        align-items: center;
        background-color: #2a2a2a;
    }

    /* Dropdown styles */
    .dropdown {
        position: right;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #333;
        min-width: 160px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        z-index: 1;
        text-align: left;
    }

    .dropdown:hover .dropdown-content {
        display: block;
    }

    .dropdown-content a {
        color: #fff;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        font-size: medium;
    }

    .dropdown-content a:hover {
        background-color: #555;
    }
</style>