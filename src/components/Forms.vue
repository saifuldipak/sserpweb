<script setup>
    import { defineModel, watchEffect } from 'vue';
    import InputSuggestion from './InputSuggestion.vue';

    const props = defineProps({
        viewName: {
            type: String,
            required: true
        },
        actionName: {
            type: String,
            required: true
        },
        clientTypes: {
            type: Array
        },
        serviceTypes: {
            type: Array
        },
        vendorTypes: {
            type: Array
        },
        contactTypes: {
            type: Array
        }
    })

    const formData = defineModel()

    const selectedSuggestion = (itemName, itemId) => {
        if (props.viewName === 'Services') {
            if (itemName === 'Clients') {
                formData.value.service.client_id = itemId
            }
            else if (itemName === 'Pops') {
                formData.value.service.pop_id = itemId
            }
        }

        if (props.viewName === 'Pops') {
            formData.value.pop.owner = itemId
        }

        if (props.viewName === 'Addresses') {
            if (itemName === 'Clients') {
                formData.value.address.client_id = itemId
            }
            else if (itemName === 'Services') {
                formData.value.address.service_id = itemId
            }
            else if (itemName === 'Vendors') {
                formData.value.address.vendor_id = itemId
            }
        }

        if (props.viewName === 'Contacts') {
            if (itemName === 'Clients') {
                formData.value.contact.client_id = itemId
            }
            else if (itemName === 'Services') {
                formData.value.contact.service_id = itemId
            }
            else if (itemName === 'Vendors') {
                formData.value.contact.vendor_id = itemId
            }
        }
    }
</script>

<template>
    <h4>{{ props.actionName }}</h4>
    <div class="form-fields">
        <div v-if="props.viewName === 'Clients'">
            <input type="text" placeholder="Client name" v-model="formData.client.name">
            <select v-model="formData.client.client_type_id">
                <option disabled value="">client types</option>
                <option placeholder="client types" v-for="clientType in props.clientTypes" :value="clientType.id">{{
                    clientType.name }}</option>
            </select>
        </div>
        <div v-else-if="props.viewName === 'Services'">
            <InputSuggestion v-if="props.actionName === 'Add'" :item-name="'Clients'"
                @selected-item-id="selectedSuggestion" />
            <InputSuggestion v-else-if="props.actionName === 'Modify'" :item-name="'Clients'" :item-data="service.clients"
                @selected-item-id="selectedSuggestion" />
            <input type="text" placeholder="Service location" v-model="formData.service.point">
            <select v-model="formData.service.service_type_id">
                <option disabled value="">select service type</option>
                <option placeholder="service type" v-for="serviceType in props.serviceTypes" :value="serviceType.id">{{
                    serviceType.name }}</option>
            </select>
            <input type="integer" placeholder="bandwidth value in Mbps" v-model="formData.service.bandwidth">
            <InputSuggestion v-if="props.actionName === 'Add'" :item-name="'Pops'" @selected-item-id="selectedSuggestion" />
            <InputSuggestion v-else-if="props.actionName === 'Modify'" :item-name="'Pops'" :item-data="service.pops"
                @selected-item-id="selectedSuggestion" />
            <input type="text" placeholder="extra info" v-model="formData.service.extra_info">
        </div>
        <div v-else-if="props.viewName === 'Service Types'">
            <input type="text" placeholder="Service types" v-model="formData.serviceTypes.name">
            <input type="text" placeholder="Description (optional)" v-model="formData.serviceTypes.description">
        </div>
        <div v-else-if="props.viewName === 'Vendors'">
            <input type="text" placeholder="Vendor name" v-model="formData.vendor.name">
            <select v-model="formData.vendor.type" required>
                <option disabled value="">select vendor type</option>
                <option placeholder="service type" v-for="vendorType in props.vendorTypes" :value="vendorType.type"
                    :key="vendorType.id">{{
                        vendorType.type }}</option>
            </select>
        </div>
        <div v-else-if="props.viewName === 'Pops'">
            <input type="text" placeholder="Pop name" v-model="formData.pop.name">
            <InputSuggestion :item-name="'Vendors'" @selected-item-id="selectedSuggestion" />
            <input type="text" placeholder="Additional information (optional)" v-model="formData.pop.extraInfo">
        </div>
        <div v-else-if="props.viewName === 'Addresses'">
            <input type="text" placeholder="Flat" v-model="formData.address.flat">
            <input type="text" placeholder="Floor" v-model="formData.address.floor">
            <input type="text" placeholder="Holding" v-model="formData.address.holding" required>
            <input type="text" placeholder="Street" v-model="formData.address.street" required>
            <input type="text" placeholder="Area" v-model="formData.address.area" required>
            <input type="text" placeholder="Thana" v-model="formData.address.thana" required>
            <input type="text" placeholder="District" v-model="formData.address.district" required>
            <InputSuggestion :item-name="'Clients'" @selected-item-id="selectedSuggestion" />
            <InputSuggestion :item-name="'Services'" @selected-item-id="selectedSuggestion" />
            <InputSuggestion :item-name="'Vendors'" @selected-item-id="selectedSuggestion" />
            <input type="text" placeholder="Addition infomation (if any)" v-model="formData.address.extra_info">
        </div>
        <div v-else-if="props.viewName === 'Contacts'">
            <input type="text" placeholder="Name" v-model="formData.contact.name">
            <input type="text" placeholder="Designation" v-model="formData.contact.designation">
            <select v-model="formData.contact.type" required>
                <option disabled value="">select contact type</option>
                <option placeholder="contact type" v-for="contactType in props.contactTypes" :value="contactType.type"
                    :key="contactType.id">{{ contactType.type }}</option>
            </select>
            <input type="text" placeholder="Phone 1" v-model="formData.contact.phone1" required>
            <input type="text" placeholder="Phone 2 (optional)" v-model="formData.contact.phone2">
            <input type="text" placeholder="Phone 3 (optional)" v-model="formData.contact.phone3">
            <InputSuggestion :item-name="'Clients'" @selected-item-id="selectedSuggestion" />
            <InputSuggestion :item-name="'Services'" @selected-item-id="selectedSuggestion" />
            <InputSuggestion :item-name="'Vendors'" @selected-item-id="selectedSuggestion" />
        </div>
    </div>
</template>

<style scoped>
    @import "@/assets/form.css";
</style>