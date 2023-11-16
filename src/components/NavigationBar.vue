<script setup>
    import { ref } from 'vue'
    import QueryResult from './QueryResult.vue';
    import AddRecord from './AddRecord.vue'

    const activeLink = ref('')

    function linkClicked(link) {
        activeLink.value = link
    }

</script>

<template>
    <ul>
        <li><a href="#" @click="linkClicked('add')" :class="{ 'active': activeLink === 'add' }">Add</a></li>
        <li><a href="#" @click="linkClicked('search')" :class="{ 'active': activeLink === 'search' }">Search</a></li>
        <li class="nav-right"><a href="#" @click="$emits('logout')">Logout</a></li>
    </ul>
    <div v-if="activeLink === 'search'">
        <QueryResult @auth-required="$emits('logout')" />
    </div>
    <div v-else-if="activeLink === 'add'">
        <AddRecord @auth-required="$emits('logout')" />
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