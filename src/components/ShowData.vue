<script setup>
    import { ref } from 'vue'
    import ClientDetails from './ClientDetails.vue';
    import ServiceDetails from './ServiceDetails.vue';

    const props = defineProps({
        data: Array,
        dataType: String
    })

    const itemDetails = ref()

    const emit = defineEmits(['modifyClient', 'deleteItem'])
</script>

<template>
    <ul v-if="props.data" class="item-list" :class="{ 'item-list-hide': itemDetails }">
        <div v-for="item in props.data" :key="item.id">
            <li>
                <div v-if="props.dataType === 'Clients'">
                    <a href="#" @click="itemDetails = item">{{ item.name }}</a>
                    <span class="item-type">{{ item.client_type.name }}</span>
                    <button @click="$emit('modifyClient', item.id)">Modify</button>
                    <button @click="$emit('deleteItem', 'Client', item.id)">Delete</button>
                </div>
                <div v-else-if="props.dataType === 'Services'">
                    <a href="#" @click="itemDetails = item">{{ item.point }}</a>
                    <span class="item-type"> {{ item.clients.name }}</span>
                </div>
            </li>
        </div>
    </ul>
    <div v-if="itemDetails">
        <button @click="itemDetails = ''">X</button>
        <ClientDetails v-if="props.dataType === 'Clients'" :item="itemDetails" />
        <ServiceDetails v-if="props.dataType === 'Services'" :item="itemDetails" />
    </div>
</template>

<style scoped>
    .item-list {
        list-style-type: none;
    }

    .item-list-hide {
        display: none;
    }

    .item-type {
        margin-left: 50px;
    }
</style>