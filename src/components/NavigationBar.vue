<script setup>
    import { ref } from 'vue'
    const activeLink = ref('')

    function linkClicked(link) {
        activeLink.value = link
    }

</script>

<template>
    <nav>
        <ul>
            <li class="dropdown">
                <img src="./icons/menu_button_2.png">
                <div class="dropdown-content">
                    <a href="#">Search</a>
                    <a href="#">Add Client</a>
                </div>
            </li>
            <li class="logout"><img src="./icons/Profile-Avatar.png">saiful</li>
        </ul>
    </nav>
    <!-- <nav>
        <ul>
            <li class="dropdown">
                <a href="#">Menu</a>
            </li>
            <div class="dropdown-content">
                <a href="#">Web Design</a>
                <a href="#">Graphic Design</a>
                <a href="#">SEO</a>
            </div>

            <li><a href="#" @click="linkClicked('search')" :class="{ 'active': activeLink === 'search' }">Search</a></li>
            <li class="nav-right"><a href="#" @click="$emits('logout')">Logout</a></li>
        </ul>
    </nav> -->
    <!-- <div v-if="activeLink === 'search'">
        <QueryResult @auth-required="$emits('logout')" />
    </div>
    <div v-else-if="activeLink === 'add'">
        <AddRecord @auth-required="$emits('logout')" />
    </div> -->
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