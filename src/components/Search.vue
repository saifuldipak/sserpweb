<script setup>
    import { ref } from 'vue'
    import { API_URL } from '@/config.js'

    const clientName = ref('')
    const clientList = ref([])
    const message = ref('')
    const emit = defineEmits(['auth-required'])
    const apiError = ref({})

    const queryApi = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            console.log('JWT not found in local storage')
            emit('auth-required')
        }

        const apiEndpoint = API_URL + 'clients/query/' + clientName.value + '?page=0&page_size=10'
        try {
            const response = await fetch(apiEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                clientList.value = await response.json()
            } else if (response.status === 401) {
                console.log('Need authentication')
                emit('auth-required')
            } else {
                apiError.value = await response.json()
            }
        } catch (error) {
            console.error('Network or API error:', error);
        }
    }

</script>

<template>
    <div class="query-page">
        <div class="query-section">
            <input class="search-input" type="text" id="clientname" placeholder="client name" v-model="clientName"
                @keyup.enter="queryApi" required />
            <button class="search-button" @click="queryApi">Search</button>
        </div>
        <div v-if="apiError.detail" class="error-message-container">
            <span class="error-message">{{ apiError.detail }}</span>
        </div>
        <div v-if="clientList.length > 0">
            <table>
                <tr class="table-header">
                    <th>Client</th>
                    <th>Service(no)</th>
                    <th>Status</th>
                </tr>
                <tr v-for="client in clientList" :key="client.id">
                    <td>{{ client.name }}</td>
                </tr>
            </table>
        </div>
        <div v-if="message" class="message">{{ message }}</div>
    </div>
</template>

<style scoped>
    .query-page {
        font-family: Roboto, Verdana, Geneva, Tahoma, sans-serif;
    }

    .query-section {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 15px 0 15px 0;
        margin: auto;
        width: 50%;
    }

    .query-label {
        padding: 5px;
    }

    .search-input {
        display: block;
        padding: 5px;
    }

    .search-button {
        margin-left: 5px;
        padding: 5px;
        background-color: whitesmoke;
    }

    h3 {
        display: block;
        padding: 5px 0 10px 0;
        text-align: center;
    }

    table {
        width: 75%;
        margin: auto;
        border-radius: 5px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
    }

    th {
        background-color: rgb(238, 234, 234);
    }

    tr:nth-child(odd) {
        background-color: rgb(195, 238, 198);
    }

    tr:nth-child(even) {
        background-color: rgb(161, 250, 165);
    }

    .error-message-container {
        text-align: center;
    }

    .error-message {
        color: red;
        text-align: center;
        background-color: whitesmoke;
        padding: 3px;

    }
</style>