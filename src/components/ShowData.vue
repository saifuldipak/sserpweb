<script setup>
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
            <td v-if="props.viewName === 'Addresses'">
                <a href="#" @click="emit('showDetails', item)">{{ item.area }}, {{ item.thana }}, {{ item.district }}</a>
            </td>
            <!-- Second column -->
            <td v-if="props.viewName === 'Clients'">{{ item.client_types.name }}</td>
            <td v-else-if="props.viewName === 'Services'">{{ item.clients.name }}</td>
            <td v-else-if="props.viewName === 'Addresses' || props.viewName === 'Contacts'">
                <div v-if="item.client_id">{{ item.clients.name }}</div>
                <div v-else-if="item.service_id">{{ item.services.point }}</div>
                <div v-else-if="item.vendor_id">{{ item.vendors.name }}</div>
            </td>
            <!-- Third column -->
            <td v-if="props.viewName === 'Pops'"> {{ item.vendors.name }}</td>
            <!-- Fourth column -->
            <td v-if="props.viewName === 'Pops'"> {{ item.extra_info }}</td>
            <!-- Fifth column -->
            <td class="button-section">
                <a href="#" v-if="props.viewName !== 'Service Types'" class="modify"
                    @click="$emit('modifyItem', item.id)"><span class="material-symbols-outlined modify-icon">
                        edit
                    </span></a>
                <a href="#" class="delete" @click="$emit('deleteItem', item.id)"><span
                        class="material-symbols-outlined delete-icon">
                        delete
                    </span></a>
            </td>
        </tr>
    </table>
</template>

<style scoped>
    td {
        padding: 0;
        padding-left: 10px;
        padding-right: 10px;
    }

    .button-section {
        display: flex;
        justify-content: space-around;
    }

    .modify-icon {
        color: rgb(215, 199, 15);
    }

    .delete-icon {
        color: red;
    }
</style>