<script setup>
    const props = defineProps({
        data: Array,
        dataType: String
    })
</script>

<template>
    <div v-if="props.data">
        <table class="data-table">
            <tr v-for="item in props.data" :key="item.id" class="data">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td v-if="props.dataType === 'Clients'">{{ item.client_type.name }}</td>
                <td v-else-if="props.dataType === 'Contacts'"> {{ item.clients.name }}</td>
            </tr>
        </table>
    </div>
</template>