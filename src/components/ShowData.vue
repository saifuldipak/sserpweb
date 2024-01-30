<script setup>
    import { ref } from 'vue'

    const itemData = ref()

    const props = defineProps({
        itemList: {
            type: Array,
            required: true
        },
        viewName: {
            type: String,
            required: true
        }
    })

    const emit = defineEmits(['showDetails', 'modifyItem', 'deleteItem'])
</script>

<template>
    <table v-if="props.itemList.length > 0">
        <tr v-for="item in props.itemList" :key="item.id">
            <!-- First column -->
            <td v-if="props.viewName !== 'Services'">
                <a href="#" @click="emit('showDetails', item)">{{ item.name }}</a>
            </td>
            <td v-else>
                <a href="#" @click="emit('showDetails', item)">{{ item.point }}</a>
            </td>
            <!-- Second column -->
            <td v-if="props.viewName === 'Clients'">{{ item.client_types.name }}</td>
            <td v-else-if="props.viewName === 'Services'">{{ item.clients.name }}</td>
            <!-- Third column -->
            <td v-if="props.viewName === 'Pops'"> {{ item.vendors.name }}</td>
            <!-- Fourth column -->
            <td v-if="props.viewName === 'Pops'"> {{ item.extra_info }}</td>
            <!-- Fifth column -->
            <td class="button-section">
                <button v-if="props.viewName !== 'Service Types'" class="modify"
                    @click="$emit('modifyItem', item.id)">Modify</button>
                <button class="delete" @click="$emit('deleteItem', item.id)">Delete</button>
            </td>
        </tr>
    </table>
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