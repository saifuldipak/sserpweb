<script setup>
    import { ref } from 'vue'

    const linkName = ref('')

    function clickedLink(link) {
        linkName.value = link
    }

</script>

<template>
    <ul>
        <li><button @click="clickedLink('service')">Add Service</button></li>
        <li><button @click="clickedLink('client')">Add Client</button></li>
        <li><button @click="clickedLink('contact')">Add Contact</button></li>
    </ul>
</template>

<style scoped>
    ul {
        list-style: none;
        background-color: white;
        display: flex;
        justify-content: center;
        margin-top: 10px;

    }

    li {
        flex: 0 0 auto;
        margin-right: 10px;
    }

    button {
        background-color: rgb(249, 234, 215);
        padding: 8px;
        border: 0px;
    }

    button:hover {
        background-color: rgb(231, 207, 177);


    }

    @media(max-width: 768px) {
        ul li {
            margin-right: 5px;
        }
    }
</style>