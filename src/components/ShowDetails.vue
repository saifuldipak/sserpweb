<script setup>
    import AddressDetails from "./AddressDetails.vue";
    import ContactDetails from "./ContactDetails.vue";

    const viewList = ["Clients", "Services", "Vendors"];

    const props = defineProps({
        viewName: {
            type: String,
            required: true,
        },
        itemDetails: {
            type: Object,
            required: true,
        },
        itemName: {
            type: String,
            required: true,
        },
    });

    const emit = defineEmits(["closeComponent", "searchItem"]);
</script>

<template>
    <div class="main-container">
        <div class="button-container">
            <button @click="emit('closeComponent')">X</button>
        </div>
        <div class="data-container">
            <!-- Heading -->
            <div class="heading-container">
                <!--Main heading -->
                <div v-if="props.itemName === 'Contacts'" id="heading">{{ props.itemDetails.name }}</div>
                <!-- <div v-if="props.viewName === 'Services'" id="heading">{{ props.itemDetails.point }}</div>
                <div v-else-if="props.viewName === 'Addresses'" id="heading">
                    <span v-if="props.itemDetails.clients">{{ props.itemDetails.clients.name }}</span>
                    <span v-else-if="props.itemDetails.services">{{ props.itemDetails.services.name }}</span>
                    <span v-else-if="props.itemDetails.vendors">{{ props.itemDetails.vendors.name }}</span>
                </div>
                <div v-else id="heading">{{ props.itemDetails.name }}</div> -->
                <!-- Sub heading-->
                <div v-if="props.itemName === 'Contacts'" id="sub-heading">{{ props.itemDetails.designation }}</div>

                <!-- <div v-if="props.viewName === 'Clients'" id="sub-heading">{{ props.itemDetails.client_types.name }}</div>
                <div v-else-if="props.viewName === 'Services'" id="sub-heading">{{ props.itemDetails.clients.name }}</div>
                <div v-else-if="props.viewName === 'Service Types'" id="sub-heading">{{ props.itemDetails.description }}</div>
                <div v-else-if="props.viewName === 'Vendors'" id="sub-heading">{{ props.itemDetails.type }}</div>
                <div v-else-if="props.viewName === 'Pops'" id="sub-heading">{{ props.itemDetails.vendors.name }}</div>
                <div v-else-if="props.viewName === 'Contacts'" id="sub-heading">{{ props.itemDetails.designation }}</div>
                <div v-else-if="props.viewName === 'Account Managers'" id="sub-heading">{{ props.itemDetails.designation }}</div> -->
            </div>

            <!-- Details -->
            <div v-if="props.itemName === 'Contacts'" id="details">
                <span><strong>Contact type:</strong> {{ props.itemDetails.type }}</span>
                <span><strong>Phone:</strong> {{ props.itemDetails.phone1 }}</span>
                <span><strong>Email:</strong> {{ props.itemDetails.email }}</span>
            </div>
            <!-- <div v-if="props.viewName === 'Clients'" id="details">
                <em>Services ({{ props.itemDetails.services.length }})</em>
                <ol>
                    <li v-for="service in props.itemDetails.services" :key="service.id">{{ service.point }} ({{ service.extra_info }})</li>
                </ol>
            </div>
            <div v-else-if="props.viewName === 'Services'" id="details">
                <span><strong>Service:</strong> {{ props.itemDetails.service_types.name }}</span>
                <span><strong>Bandwidth:</strong> {{ props.itemDetails.bandwidth }} Mbps</span>
                <span><strong>Pop:</strong> {{ props.itemDetails.pops.name }}</span>
            </div>
            <div v-else-if="props.viewName === 'Contacts'" id="details">
                <span v-if="props.itemDetails.clients"><strong>Client:</strong>{{ props.itemDetails.clients.name }}</span>
                <span v-if="props.itemDetails.services"><strong>Service:</strong>{{ props.itemDetails.services.name }}</span>
                <span v-if="props.itemDetails.vendors"><strong>Vendor:</strong>{{ props.itemDetails.vendors.name }}</span>
                <span><strong>Contact Type:</strong> {{ props.itemDetails.type }}</span>
                <span><strong>Phone1:</strong> {{ props.itemDetails.phone1 }}</span>
            </div>
            <div v-else-if="props.viewName === 'Addresses'" id="details">
                <span><strong>Flat:</strong> {{ props.itemDetails.flat }}</span>
                <span><strong>Floor:</strong> {{ props.itemDetails.floor }}</span>
                <span><strong>Holding:</strong> {{ props.itemDetails.holding }}</span>
                <span><strong>Street:</strong> {{ props.itemDetails.street }}</span>
                <span><strong>Area:</strong> {{ props.itemDetails.area }}</span>
                <span><strong>Thana:</strong> {{ props.itemDetails.thana }}</span>
                <span><strong>District:</strong> {{ props.itemDetails.district }}</span>
            </div> -->

            <!-- Contacts & Addresses list -->
            <div v-if="viewList.includes(props.viewName)" id="contacts">
                <em>Contacts({{ props.itemDetails.contacts.length }})</em>
                <ol>
                    <li v-for="contact in props.itemDetails.contacts" :key="contact.id">
                        <ContactDetails :item-details="contact" :view-name="viewName" />
                    </li>
                </ol>
            </div>
            <div v-if="viewList.includes(props.viewName)" id="addresses">
                <em>Addresses({{ props.itemDetails.addresses.length }})</em>
                <ol>
                    <li v-for="address in props.itemDetails.addresses" :key="address.id">
                        <AddressDetails :item-details="address" :view-name="viewName" />
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .main-container {
        width: 40%;
        display: flex;
        flex-direction: column;
        border: 1px solid lightgray;
        border-radius: 3%;
        box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.5);
        justify-content: flex-start;
    }

    .button-container {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }

    .button-container button {
        border-radius: 5px;
        margin: 1%;
        background: rgb(233, 228, 228);
        border: none;
    }

    .data-container {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 2%;
    }

    .data-container div:not(.heading-container) {
        border-radius: 10px;
        padding: 3%;
        margin: 1%;
    }

    .heading-container {
        margin: 0;
        margin-bottom: 15px;
        color: brown;
        padding-left: 3%;
    }

    #heading,
    #sub-heading {
        padding: 0;
        margin: 0;
    }

    #heading {
        font-weight: bolder;
        font-size: larger;
    }

    #sub-heading {
        font-size: medium;
    }

    .data-container ol {
        margin-top: 0;
    }

    #contacts {
        background-color: bisque;
    }

    #addresses {
        background-color: lightgray;
    }

    #details {
        overflow: auto;
        display: flex;
        flex-direction: column;
        background-color: rgb(252, 208, 214);
    }
</style>
