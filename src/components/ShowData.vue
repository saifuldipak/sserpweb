<script setup>
    import { ref } from 'vue'
    import ShowDetails from './ShowDetails.vue';

    const props = defineProps({
        data: Array,
        dataType: String
    })

    const itemDetails = ref()
</script>

<template>
    <ul v-if="props.data" class="item-list" :class="{ 'item-list-hide': itemDetails }">
        <div v-for="item in props.data" :key="item.id">
            <li>
                <a href="#" @click="itemDetails = item">{{ item.name }}</a>
                <span class="item-type" v-if="props.dataType === 'Clients'">{{ item.client_type.name }}</span>
                <span v-else-if="props.dataType === 'Contacts'"> {{ item.clients.name }}</span>
            </li>
        </div>
    </ul>
    <div v-if="itemDetails">
        <button @click="itemDetails = ''">X</button>
        <ShowDetails :item="itemDetails" />
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