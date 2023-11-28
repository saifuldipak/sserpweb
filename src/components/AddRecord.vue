<script setup>
    import { ref } from 'vue'
    import { onMounted } from 'vue';
    import { API_URL } from '@/config.js'

    const clientTypeList = ref([])
    const emit = defineEmits(['auth-required'])
    const apiError = ref({})
    const apiMessage = ref('')
    const clientName = ref('')
    const clientType = ref(0)
    const props = defineProps(['formType'])

    const token = localStorage.getItem('token')
    if (!token) {
        console.log('JWT not found in local storage')
        emit('auth-required')
    }

    onMounted(async () => {
        const apiEndpoint = API_URL + 'clients/types/get'
        try {
            const response = await fetch(apiEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (response.status === 200) {
                clientTypeList.value = await response.json()
            }
            else if (response.status === 401) {
                console.log('Need authentication')
                emit('auth-required')
            }
            else {
                apiError.value = await response.json()
            }
        }
        catch (error) {
            apiError.value.detail = 'Network or API error'
            console.error('Network or API error:', error.message)
        }
    })

    const addClient = async () => {
        apiMessage.value = ''
        apiError.value.detail = ''

        const apiEndpoint = API_URL + 'clients/add'
        const clientData = {
            'name': clientName.value,
            'client_type_id': parseInt(clientType.value),
        }

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(clientData)
            });

            if (response.status === 200) {
                apiMessage.value = `Client "${clientName.value}" added successfully`
                console.log(await response.json())
            } else if (response.status === 401) {
                console.log('Need authentication')
                emit('auth-required')
            }
            else if (response.status === 400) {
                apiError.value.detail = 'Client exists'
                console.log(await response.json())
            } else {
                apiError.value.detail = 'Failed to add client, please see console'
                console.log(await response.json())
            }
        } catch (error) {
            apiError.value.detail = 'Network or API error'
            console.error('Network or API error:', error.message)
        }
    }
</script>

<template>
    <form @submit.prevent="addClient">
        <div class="form-section">
            <div class="form-title">{{ formType }}</div>
            <div v-if="apiError.detail" class="message-container">
                <span class="message-format error-message">{{ apiError.detail }}</span>
            </div>
            <div v-if="apiMessage" class="message-container">
                <span class="message-format success-message"> {{ apiMessage }}</span>
            </div>
            <div v-if="props.formType === 'Add Client'">
                <label for="client-name">Client Name</label>
                <input type="text" id="field1" name="client-name" v-model="clientName">
                <label for="client-type">Client Type:</label>
                <select id="client-type" name="client-type" v-model="clientType">
                    <option value="" disabled>Please select</option>
                    <option v-for="clientType in clientTypeList" :key="clientType.id" :value="clientType.id">{{
                        clientType.name }}
                    </option>
                </select>
            </div>
            <div v-if="props.formType === 'Add Contacts'">
                <label for="fullname">Contact Name</label>
                <input type="text" id="fullname" name="fullname">
                <label for="contact-type">Contact Type:</label>
                <select id="contact-type" name="contact-type">
                    <option value="admin">Admin</option>
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                </select>
                <label for="designation">Designation</label>
                <input type="text" id="designation" name="designation">
                <label for="phone-number">Phone Number</label>
                <input type="tel" id="phone-number" name="phone-number" pattern="01[3-9]{1}[0-9]{8}"
                    placeholder="01745667890">
            </div>
            <div v-if="props.formType === 'Add Services'">
                <label for="service-location">Service Location</label>
                <input type="text" id="service-location" name="service-location">
                <label for="bandwidth">Bandwidth</label>
                <input type="number" id="bandwidth" name="bandwidth" placeholder="Enter a positive number" min="1" step="1">
                <label>Bandwidth type:</label>
                <input type="radio" id="data" name="options" value="data">
                <label for="option1">Data</label>
                <input type="radio" id="internet" name="options" value="internet">
                <label for="option2">Internet</label>
            </div>
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

    .message-container {
        text-align: center;
    }

    .message-format {
        text-align: center;
        background-color: whitesmoke;
        padding: 3px;

    }

    .error-message {
        color: red;
    }

    .success-message {
        color: green;
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