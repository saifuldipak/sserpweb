<script setup>
    import { ref, computed } from "vue";

    const itemsPerPage = ref(10);
    const currentPage = ref(1);

    const props = defineProps({
        searchResults: {
            type: Array,
            required: true,
        },
        viewName: {
            type: String,
            required: true,
        },
    });

    const emit = defineEmits(["showDetails", "modifyItem", "deleteItem"]);

    const paginatedItems = computed(() => {
        const start = (currentPage.value - 1) * parseInt(itemsPerPage.value);
        const end = start + parseInt(itemsPerPage.value);
        return props.searchResults.slice(start, end);
    });

    const totalPages = computed(() => Math.ceil(props.searchResults.length / itemsPerPage.value));

    // Method to switch to a specific page
    const changePage = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages.value) {
            currentPage.value = pageNumber;
        }
    };
</script>

<template>
    <div class="filter-menu">
        <span class="item1">Result per page</span>
        <select class="item2" v-model="itemsPerPage" @change="changePage(1)">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
        </select>
    </div>
    <table v-if="props.searchResults.length > 0">
        <tr v-for="item in paginatedItems" :key="item.id">
            <!-- First column -->
            <td v-if="props.viewName === 'Services'">
                <a href="#" @click="emit('showDetails', item)">{{ item.point }}</a>
            </td>
            <td v-else-if="props.viewName === 'Account Managers'">
                <a href="#" @click="emit('showDetails', item.contacts, 'Contacts')">{{ item.contacts.name }}</a>
            </td>
            <td v-else-if="props.viewName === 'Addresses'">
                <a href="#" @click="emit('showDetails', item)">{{ item.area }}, {{ item.thana }}, {{ item.district }}</a>
            </td>
            <td v-else>
                <a href="#" @click="emit('showDetails', item)">{{ item.name }}</a>
            </td>

            <!-- Second column -->
            <td v-if="props.viewName === 'Clients'">{{ item.client_types.name }}</td>
            <td v-else-if="props.viewName === 'Services'">{{ item.clients.name }}</td>
            <td v-else-if="props.viewName === 'Addresses' || props.viewName === 'Contacts'">
                <div v-if="item.client_id">{{ item.clients.name }}</div>
                <div v-else-if="item.service_id">{{ item.services.point }}</div>
                <div v-else-if="item.vendor_id">{{ item.vendors.name }}</div>
            </td>
            <td v-else-if="props.viewName === 'Account Managers'">
                <a href="#" @click="emit('showDetails', item.clients)">{{ item.clients.name }}</a>
            </td>
            <!-- Third column -->
            <td v-if="props.viewName === 'Pops'">{{ item.vendors.name }}</td>
            <!-- Fourth column -->
            <td v-if="props.viewName === 'Pops'">{{ item.extra_info }}</td>
            <!-- Fifth column -->
            <!-- <td class="button-section">
                <a
                    href="#"
                    v-if="props.viewName !== 'Service Types' && props.viewName !== 'Account Managers'"
                    class="modify"
                    @click="$emit('modifyItem', item.id)"
                >
                    <span class="material-symbols-outlined modify-icon"> edit </span>
                </a>
                <a href="#" class="delete" @click="$emit('deleteItem', item.id)"><span class="material-symbols-outlined delete-icon"> delete </span></a>
            </td> -->
        </tr>
    </table>
    <nav class="pagination-nav">
        <button class="item1" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
        <span class="item2">Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="item3" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    </nav>
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

    .pagination-nav {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        padding: 15px;
    }

    .pagination-nav .item1 {
        width: 60px;
        height: 30px;
        font-size: 11px;
        grid-column: 1;
        grid-row: 1;
    }

    .pagination-nav.item2 {
        grid-column: 2;
        grid-row: 1;
        font-size: 14px;
        align-self: center;
    }

    .pagination-nav .item3 {
        width: 60px;
        height: 30px;
        font-size: 11px;
        grid-column: 3;
        grid-row: 1;
        justify-self: end;
    }

    .filter-menu {
        display: grid;
    }
    .filter-menu .item1 {
        font-size: 13px;
        grid-column: 1;
        grid-row: 1;
    }
    .filter-menu .item2 {
        grid-column: 2;
        grid-row: 1;
    }
</style>
