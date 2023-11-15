<script setup>
    import { ref } from 'vue'

    const emit = defineEmits(['auth-required'])
    const linkName = ref('')
    const message = ref('')
    const apiUrl = 'http://127.0.0.1:8000/'
    const clientName = ref('')

    function clickedLink(link) {
        linkName.value = link
        message.value = ''
        clientName.value = ''
    }

    async function addClient() {
        const apiEndpoint = apiUrl + 'clients/add'

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'name': clientName.value,
                })
            });

            if (response.status === 200) {
                message.value = `Client ${clientName.value} added successfully`
            } else if (response.status === 401) {
                console.log('Need authentication')
                emit('auth-required')
            } else if (response.status === 400) {
                message.value = 'Client exists'
            }
            else {
                console.log('Unknown error')
            }
        } catch (error) {
            console.error('Network or API error:', error);
        }
    }

</script>

<template>
    <ul>
        <li><button @click="clickedLink('service')">Add Service</button></li>
        <li><button @click="clickedLink('client')">Add Client</button></li>
        <li><button @click="clickedLink('contact')">Add Contact</button></li>
    </ul>

    <div v-if="linkName === 'client'">
        <div v-if="message">{{ message }}</div>
        <form @submit.prevent="addClient">
            <input v-model="clientName" type="text" placeholder="client name">
            <button type="submit">Add</button>
        </form>
    </div>
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