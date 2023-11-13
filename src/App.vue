<script setup>
    import { ref } from 'vue';
    import UserLogin from './components/UserLogin.vue';
    import QueryResult from './components/QueryResult.vue';

    const activeLink = ref('')
    const token = ref('')
    const query = ref('')

    function logout() {
        localStorage.removeItem('token');
        token.value = localStorage.getItem('token')
    }

    function updateToken() {
        token.value = localStorage.getItem('token')
    }

    function activateLink(link) {
        activeLink.value = link
        query.value = link
    }

</script>

<template>
    <div v-if="token">
        <ul>
            <li><a href="#" @click="activateLink('client')" :class="{ 'active': activeLink === 'client' }">Client</a></li>
            <li><a href="#" @click="activateLink('user')" :class="{ 'active': activeLink === 'user' }">User</a></li>
            <li class="nav-right"><a href="#" @click="logout">Logout</a></li>
        </ul>
        <div v-if="query">
            <QueryResult @auth-required="logout" />
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
        overflow: hidden;
        background-color: #333;
    }

    li {
        float: left;
        border-right: 1px solid #bbb;

    }

    li a {
        display: block;
        color: white;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
    }

    .active {
        background-color: rgb(3, 170, 114);
        color: black;
    }

    li.nav-right {
        float: right;
    }
</style>
