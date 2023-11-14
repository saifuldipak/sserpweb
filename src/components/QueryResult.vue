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
        <div class="query-section">
            <div class="query-label">Search client</div>
            <div class="query-input">
                <input type="text" id="clientname" placeholder="client name" v-model="clientName" @keyup.enter="queryApi"
                    required />
            </div>

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
</style>