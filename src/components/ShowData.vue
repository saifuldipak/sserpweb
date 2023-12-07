<script setup>
    const props = defineProps({
        data: Array,
        dataType: String
    })
</script>

<template>
    <div v-if="props.dataType === 'Clients'">
        <table v-if="props.data" class="data-table">
            <tr v-for="client in props.data" :key="client.id" class="client-list">
                <td>{{ client.id }}</td>
                <td>{{ client.name }}</td>
                <td>{{ client.client_type.name }}</td>
            </tr>
        </table>
    </div>
</template>