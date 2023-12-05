<script setup>
    import { ref } from 'vue'

    const showClient = ref('')

    const props = defineProps({
        clients: Array
    })

</script>
<template>
    <!-- search result presentation -->
    <div v-if="props.clients.length > 0">
        <table>
            <tr class="table-header">
                <th>Id</th>
                <th>Name</th>
            </tr>
            <tr v-for=" client  in  props.clients " :key="client.id">
                <td><a href="#">{{ client.id }}</a></td>
                <td><a href="#" @click="showClient = client.name">{{ client.name }}</a> </td>
            </tr>
        </table>
    </div>
    <div v-if="showClient">
        <ul v-for="client in props.clients" :key="client.id">
            <div v-if="client.name === showClient">
                <li>Client Id: {{ client.id }}</li>
                <li>Client Name: {{ clientname }}</li>
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
</style>