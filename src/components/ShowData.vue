<script setup>
    import { ref, watch } from 'vue'

    const hideList = ref(false)
    const showClient = ref('')
    const hideDetails = ref(true)

    const props = defineProps({
        clients: Array
    })

    function toggleListAndDetails(clientName = '') {
        showClient.value = clientName

        if (hideList.value === false && hideDetails.value === true) {
            hideList.value = true
            hideDetails.value = false
        }
        else {
            hideList.value = false
            hideDetails.value = true
        }
    }

    watch(props, () => {
        hideList.value = false
        hideDetails.value = true
    })

</script>
<template>
    <!-- search result presentation -->
    <div v-if="props.clients.length > 0">
        <table :class="{ 'client-list-hide': hideList }">
            <tr class="table-header">
                <th>Id</th>
                <th>Name</th>
            </tr>
            <tr v-for=" client  in  props.clients " :key="client.id">
                <td><a href="#">{{ client.id }}</a></td>
                <td><a href="#" @click="toggleListAndDetails(client.name)">{{ client.name }}</a> </td>
            </tr>
        </table>
    </div>
    <div v-if="showClient" :class="{ 'client-details-hide': hideDetails }">
        <button @click="toggleListAndDetails">Show search result</button>
        <ul v-for="client in props.clients" :key="client.id">
            <div v-if="client.name === showClient">
                <li>Client Id: {{ client.id }}</li>
                <li>Client Name: {{ client.name }}</li>
                <li>Client Type: {{ client.client_type.name }}</li>
                <li>Contacts:
                    <ul v-for=" contact  in  client.contacts " :key="contact.id">
                        <li>Name: {{ contact.name }}, Designation: {{ contact.designation }}, Type: {{ contact.type
                        }},
                            Phone: {{ contact.phone }},
                        </li>
                    </ul>
                </li>
            </div>
        </ul>
    </div>
</template>

<style scoped>
    /*client list*/
    table {
        width: 75%;
        margin: auto;
        border-radius: 5px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .client-list-hide {
        display: none;
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

    /*client details*/
    .client-details-hide {
        display: none;
    }
</style>