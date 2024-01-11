<script setup>
    import { onMounted, ref } from 'vue'
    import ClientDetails from './ClientDetails.vue';
    import ServiceDetails from './ServiceDetails.vue';

    const props = defineProps({
        data: Array,
        viewName: String
    })

    const itemDetails = ref()

    const emit = defineEmits(['modifyItem', 'deleteItem'])

    /* onMounted(() => {
        console.log(props.data, props.dataType)
    }) */
</script>

<template>
    <ul v-if="props.data" class="item-list" :class="{ 'item-list-hide': itemDetails }">
        <div v-for="item in props.data" :key="item.id">
            <li>
                <div v-if="props.viewName === 'Clients'">
                    <a href="#" @click="itemDetails = item">{{ item.name }}</a>
                    <span class="item-type">{{ item.client_type.name }}</span>
                    <button @click="$emit('modifyItem', 'Client', item.id)">Modify</button>
                    <button @click="$emit('deleteItem', 'Client', item.id)">Delete</button>
                </div>
                <div v-else-if="props.viewName === 'Services'">
                    <a href="#" @click="itemDetails = item">{{ item.point }}</a>
                    <span class="item-type"> {{ item.clients.name }}</span>
                </div>
                <div v-else-if="props.viewName === 'Service Types'">
                    <span class="item-type">{{ item.name }}</span>
                </div>
                <div v-else-if="props.viewName === 'Vendors'">
                    <span class="item-type">{{ item.name }}</span>
                </div>
                <div v-else-if="props.viewName === 'Pops'">
                    <span class="item-type">{{ item.name }}</span>
                </div>
            </li>
        </div>
    </ul>
    <div v-if="itemDetails">
        <button @click="itemDetails = ''">X</button>
        <ClientDetails v-if="props.viewName === 'Clients'" :item="itemDetails" />
        <ServiceDetails v-if="props.viewName === 'Services'" :item="itemDetails" />
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