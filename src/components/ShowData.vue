<script setup>
    import { ref } from 'vue'
    import ClientDetails from './ClientDetails.vue';
    import ServiceDetails from './ServiceDetails.vue';

    const props = defineProps({
        data: Array,
        viewName: String
    })

    const itemDetails = ref()

    const emit = defineEmits(['modifyItem', 'deleteItem'])
</script>

<template>
    <table v-if="props.data" :class="{ 'item-list-hide': itemDetails }">
        <tr v-for="item in props.data" :key="item.id">
            <td v-if="props.viewName === 'Clients'">
                <a href="#" @click="itemDetails = item">{{ item.name }}</a>
            </td>
            <div v-else-if="props.viewName === 'Services'">
                <a href="#" @click="itemDetails = item">{{ item.point }}</a>
            </div>
            <div v-else-if="props.viewName === 'Service Types'">
                <a href="#" @click="itemDetails = item">{{ item.point }}</a>
            </div>
            <div v-else-if="props.viewName === 'Vendors'">
                <a href="#" @click="itemDetails = item">{{ item.point }}</a>
            </div>
            <div v-else-if="props.viewName === 'Pops'">
                <a href="#" @click="itemDetails = item">{{ item.point }}</a>
            </div>
            <td v-if="props.viewName === 'Clients'">{{ item.client_type.name }}</td>
            <div v-else-if="props.viewName === 'Services'">{{ item.clients.name }}</div>
            <td class="button-section">
                <button class="modify" @click="$emit('modifyItem', item.id)">Modify</button>
                <button class="delete" @click="$emit('deleteItem', item.id)">Delete</button>
            </td>
        </tr>
    </table>
    <div v-if="itemDetails">
        <button @click="itemDetails = ''">X</button>
        <ClientDetails v-if="props.viewName === 'Clients'" :item="itemDetails" />
        <ServiceDetails v-if="props.viewName === 'Services'" :item="itemDetails" />
    </div>
</template>

<style scoped>
    .item-list {
        width: 50%;
        display: flex;
        justify-content: left;
    }

    .item-list-hide {
        display: none;
    }

    td {
        padding: 0;
        padding-left: 10px;
        padding-right: 10px;
    }

    .button-section {
        display: flex;
        justify-content: space-around;
    }

    .modify {
        background-color: yellow;
    }

    .delete {
        background-color: red;
        color: white;
    }
</style>