<script setup>
    import { ref } from 'vue'

    const clientName = ref('')
    const clientList = ref([])
    const message = ref('')
    const apiUrl = 'http://127.0.0.1:8000/';
    const emit = defineEmits(['auth-required'])

    const queryApi = async () => {
        const apiEndpoint = apiUrl + 'clients/query/' + clientName.value + '?page=0&page_size=10'

        try {
            const response = await fetch(apiEndpoint, {
                method: 'GET',
            });

            if (response.status === 200) {
                clientList.value = await response.json()
                if (clientList.value.length === 0) {
                    message.value = 'No record found'
                }
                else {
                    message.value = ''
                }
            } else if (response.status === 401) {
                console.log('Need authentication')
                emit('auth-required')
            } else {
                console.log('Not found')
            }
        } catch (error) {
            console.error('Network or API error:', error);
        }
    }

</script>

<template>
    <div class="query-page">
        <h3>Search client</h3>
        <input class="query-input" type="text" id="clientname" placeholder="client name" v-model="clientName"
            @keyup.enter="queryApi" required />
    </div>
    <div v-if="clientList.length > 0">
        <h3>Client List</h3>
        <table>
            <tr>
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
</template>

<style scoped>
    .query-page {
        padding: 15px 0 0 0;
        font-family: roboto;
        margin: auto;
        width: 50%;
    }

    .query-input {
        display: block;
        padding: 2px;
    }

    h3 {
        display: block;
        padding: 5px 0 10px 0;
        text-align: center;
    }

    table {
        width: 50%;
        margin: auto;
    }
</style>