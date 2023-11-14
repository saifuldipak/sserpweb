<script setup>
    import { ref } from 'vue';
    import NavigationBar from './components/NavigationBar.vue';
    import UserLogin from './components/UserLogin.vue';

    const token = ref('')

    function removeToken() {
        localStorage.removeItem('token');
        token.value = localStorage.getItem('token')
    }

    function updateToken() {
        token.value = localStorage.getItem('token')
    }

</script>

<template>
    <div v-if="token">
        <NavigationBar @logout="removeToken" />
    </div>
    <div v-else>
        <UserLogin @login-success="updateToken" />
    </div>
</template>

<style scoped></style>
