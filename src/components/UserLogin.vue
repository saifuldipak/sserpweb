<script setup>
    import { ref } from 'vue';
    import { API_URL } from '@/config';

    const username = ref('');
    const password = ref('');
    const userAuthenticated = ref('');
    const errorMessage = ref('');
    const emit = defineEmits(['login-success'])

    const login = async () => {
        const apiEndpoint = API_URL + 'token'
        try {
            const formData = new FormData()
            formData.append('username', username.value);
            formData.append('password', password.value);

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                body: formData,
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.headers.get('access_token'))
                userAuthenticated.value = 'yes'
                emit('login-success')
            } else if (response.status === 401) {
                userAuthenticated.value = 'invalid'
                //console.error('Authentication failed (401 Unauthorized)');
                // You can perform specific handling for unauthorized access here
            } else {
                userAuthenticated.value = 'unauthorized'
                //console.error('Authentication failed');
            }
        } catch (error) {
            errorMessage.value = 'Network error'
            console.error('Network or API error:', error);
        }
    };
</script>


<template>
    <div class="login-page">
        <div class="login-form">
            <div class="login-form-header">
                <h3>CRM</h3>
                <p v-if="userAuthenticated === 'invalid'" class="error-message">Username or password incorrect</p>
                <p v-else-if="userAuthenticated === 'unauthorized'" class="error-message">Authentication failed</p>
                <p v-else-if="errorMessage" class="network-error">{{ errorMessage }}</p>
            </div>
            <form @submit.prevent="login">
                <input type="text" id="username" placeholder="username" v-model="username" required />
                <input type="password" id="password" placeholder="password" v-model="password" required />
                <button>login</button>
            </form>
        </div>
    </div>
</template>
  
<style scoped>
    @import url(https://fonts.googleapis.com/css?family=Roboto:300);

    .login-page {
        padding: 10% 0;
    }

    .login-form {
        margin: auto;
        width: 50%;
        padding: 40px;
        z-index: 1;
        background: #FFFFFF;
        max-width: 360px;
        text-align: center;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
        border: 1px solid #4CAF50;
        border-radius: 10px;
    }

    .login-form input {
        font-family: "Roboto", sans-serif;
        outline: 0;
        background: #f2f2f2;
        width: 100%;
        border: 0;
        margin: 0 0 15px;
        padding: 15px;
        box-sizing: border-box;
        font-size: 14px;
    }

    .login-form button {
        font-family: "Roboto", sans-serif;
        text-transform: uppercase;
        font-weight: 1000;
        outline: 0;
        background-image: linear-gradient(45deg, #66c0bc, #08ac4b);
        width: 100%;
        border: 0;
        padding: 15px;
        color: #FFFFFF;
        font-size: 14px;
        -webkit-transition: all 0.3 ease;
        transition: all 0.3 ease;
        cursor: pointer;
    }

    .login-form-header p {
        background-color: #f9f4f4;
        font-size: 14px;
        padding: 5px;
    }

    .login-form-header .error-message {
        color: red
    }
</style>
 
