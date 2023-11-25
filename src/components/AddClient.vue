<script setup>
    import { ref } from 'vue'
    import { onMounted } from 'vue';
    import { API_URL } from '@/config.js'

    const clientTypeList = ref([])
    const errorMessage = ref('')
    const selectedClientType = ref('')
    const clientType = ref('')
    const emit = defineEmits(['auth-required'])

    onMounted(async () => {
        const apiEndpoint = API_URL + 'clients/types/get'
        try {
            const response = await fetch(apiEndpoint, {
                method: 'GET',
            })

            if (response.status === 200) {
                clientTypeList.value = await response.json()
            }
            else if (response.status === 401) {
                emit('auth-required')
            }
        }
        catch (error) {
            console.error('Network or API error:', error);
            errorMessage.value = 'Error getting client types'
        }
    })

    const queryApi = async () => {
        const apiEndpoint = API_URL + 'clients/query/' + clientName.value + '?page=0&page_size=10'

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
    <form>
        <div class="form-section">
            <div class="form-title">Add Client</div>
            <label for="client-name">Client Name</label>
            <input type="text" id="field1" name="client-name">
            <label for="client-type">Client Type:</label>
            <select id="client-type" name="client-type" v-model="selectedClientType">
                <option value="" disabled>Please select</option>
                <option v-for="clientType in clientTypeList" :key="clientType.id" :value="clientType.id">{{
                    clientType.name }}
                </option>
            </select>
            <button type="submit">Add</button>
        </div>

    </form>
</template>



<style scoped>
    .form-section {
        margin: auto;
        padding: 10px;
        width: 80%;
        background-color: bisque;
        margin-bottom: 10px;
        margin-top: 10px;
        border-radius: 10px;
        box-shadow: 3px 5px 10px 0px rgba(0, 0, 0, 0.2);

    }

    .form-title {
        margin: auto;
        width: 90%;
        text-align: center;
        /*  background-color: rgb(247, 199, 135); */
        font-size: x-large;
        margin-bottom: 8px;

    }

    label,
    input,
    select {
        display: block;
        width: 90%;
        margin: auto;

    }

    label {
        padding: 5px;
    }

    input,
    select {
        padding: 8px;
        margin-bottom: 10px;
        box-sizing: border-box;
    }

    button {
        display: block;
        margin: auto;
        width: 40%;
        padding: 8px;
        background-color: rgb(194, 145, 85);
        color: white;
        border: none;
        border-radius: 7px;
        font-size: medium;
    }

    @media screen and (min-width: 768px) {

        label,
        input,
        select {
            width: 95%;
        }

        .form-section {
            width: 40%;
        }

        .form-title {
            width: 40%
        }
    }
</style>