<script setup>
    import { ref } from 'vue'
    import { API_URL } from '@/config.js'

    const clientName = ref('')
    const message = ref('')
    const emit = defineEmits(['auth-required'])
    const apiError = ref({})
    const clientDetails = ref([])
    const showClient = ref('')
    const showSearchOptions = ref(false)
    const contactName = ref('')
    const contactPhone = ref('')
    const clickedSearchForm = ref('')

    const callApi = async (apiEndpoint) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("JWT not found in local storage");
            emit("auth-required");
        }

        try {
            const response = await fetch(apiEndpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                return await response.json()
            } else if (response.status === 401) {
                console.log("Need authentication");
                emit("auth-required");
            } else {
                apiError.value = await response.json();
            }
        } catch (error) {
            console.error("Network or API error:", error);
        }
    };

    async function searchClient(clientName) {
        const apiEndpoint = API_URL + 'clients/search/' + clientName
        clientDetails.value = await callApi(apiEndpoint)
    }

    const toggleCustomSearch = () => {
        if (showSearchOptions.value) {
            showSearchOptions.value = false
            clickedSearchForm.value = ''
        }
        else {
            showSearchOptions.value = true
            clickedSearchForm.value = 'client'
        }

    }
</script>

<template>
    <!-- Simple search form -->
    <div class="search-page">
        <form @submit.prevent="searchClient(clientName)">
            <div class="simple-search">
                <input type="text" id="clientname" placeholder="client name" required v-model="clientName" />
                <a href="#" @click="toggleCustomSearch"><img src="./icons/settings-icon-14976.png" class="icon"
                        alt="Asvanced search options"></a>

                <button>Search</button>
            </div>
        </form>
        <!-- Advanced search form shows/hides only when the button pressed -->
        <div v-if="showSearchOptions" class="advanced-search">
            <div class="advanced-search-links">
                <button @click="clickedSearchForm = 'client'"
                    :class="{ 'link-active': clickedSearchForm === 'client' }">Clients</button>
                <button @click="clickedSearchForm = 'contact'"
                    :class="{ 'link-active': clickedSearchForm === 'contact' }">Contacts</button>
                <button>Services</button>
            </div>
            <div v-if="clickedSearchForm" class="advanced-search-form">
                <div v-if="clickedSearchForm === 'client'">
                    <label for="client-name">Client Name</label>
                    <input type="text" id="client-name" placeholder="client name" required v-model="clientName" />
                    <label for="client-type">Client Type</label>
                    <select id="client-type" name="client-type" v-model="clientType">
                        <option value="" disabled>Please select</option>
                        <option v-for=" clientType  in  clientTypeList " :key="clientType.id" :value="clientType.id">{{
                            clientType.name }}
                        </option>
                    </select>
                </div>
                <div v-if="clickedSearchForm === 'contact'">
                    <label for="client-name">Client Name</label>
                    <input type="text" id="client-name" placeholder="client name" required v-model="clientName" />
                    <label for="contact-name">Contact Name</label>
                    <input type="text" id="contact-name" placeholder="contact name" required v-model="contactName" />
                </div>
                <button>Search</button>
            </div>
        </div>
    </div>

    <div v-if="apiError.detail" class="error-message-container">
        <span class="error-message">{{ apiError.detail }}</span>
    </div>
    <!-- search result presentation -->
    <div v-if="clientDetails.length > 0">
        <table>
            <tr class="table-header">
                <th>Id</th>
                <th>Name</th>
            </tr>
            <tr v-for=" client  in  clientDetails " :key="client.id">
                <td><a href="#">{{ client.id }}</a></td>
                <td><a href="#" @click="showClient = client.name">{{ client.name }}</a> </td>
            </tr>
        </table>
    </div>
    <div v-if="showClient">
        <div v-if="clientDetails">
            <ul v-for=" clientDetail  in  clientDetails " :key="clientDetail.id">
                <div v-if="clientDetail.name === showClient">
                    <li>Client Id: {{ clientDetail.id }}</li>
                    <li>Client Name: {{ clientDetail.name }}</li>
                    <li>Client Type: {{ clientDetail.client_type.name }}</li>
                    <li>Contacts:
                        <ul v-for=" contact  in  clientDetail.contacts " :key="contact.id">
                            <li>Name: {{ contact.name }}, Designation: {{ contact.designation }}, Type: {{ contact.type
                            }},
                                Phone: {{ contact.phone }},
                            </li>
                        </ul>
                    </li>
                </div>
            </ul>
        </div>
    </div>
    <div v-if="message" class="message">{{ message }}</div>
</template>

<style scoped>
    .search-page {
        font-family: Roboto, Verdana, Geneva, Tahoma, sans-serif;
    }

    .simple-search {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 15px 0 5px 0;
        width: 50%;
        margin: auto;
    }

    .simple-search input,
    img,
    button {
        display: block;
        margin: 0;
    }

    .simple-search img {
        height: 30px;
        width: 30px;
        padding: 2px;
    }

    .simple-search input,
    button {
        height: 25px;
    }

    .simple-search button {
        background-color: whitesmoke;
        height: 30px;
    }

    /*search result presentation*/
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

    /* advanced search links */
    .advanced-search {
        width: 80%;
        margin: auto;
    }

    .advanced-search-links {
        display: flex;
        width: 60%;
        margin: auto;
        justify-content: space-around;

    }

    .advanced-search-links button {
        display: block;
        width: auto;
        margin: 0;
        padding: 0 10px 0 10px;
        border: 0;
        border-left: 1px solid grey;
        border-right: 1px solid grey;


    }

    button.link-active {
        background-color: rgb(141, 217, 242);
        border-bottom: none;
    }

    /*advacned search form*/
    .advanced-search-form {
        background-color: rgb(141, 217, 242);
        display: flex;
        flex-direction: column;
        margin: auto;
        padding: 10px;
        align-items: center;
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    }

    .advanced-search-form div {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .advanced-search-form label,
    .advanced-search-form input,
    .advanced-search-form select,
    .advanced-search-form button {
        display: block;
        width: 90%;
        padding: 5px;
        box-sizing: border-box;
        font-size: smaller;
    }

    .advanced-search-form button {
        margin-top: 15px;
        margin-bottom: 10px;
        box-sizing: content-box;
        padding: 0;
    }

    @media screen and (min-width: 768px) {
        table {
            width: 50%;
        }

        .advanced-search-links {
            justify-content: center;
        }

        .advanced-search-form {
            width: 40%;
        }
    }
</style>