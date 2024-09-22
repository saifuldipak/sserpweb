import { ref } from "vue";

export const apiError = ref();
export const notification = ref({
    type: "",
    message: "",
});

export const formData = ref({
    client: {
        name: "",
        client_type_id: "",
    },
    service: {
        client_id: "",
        point: "",
        service_type_id: "",
        bandwidth: "",
        pop_id: "",
        extra_info: "",
    },
    serviceTypes: {
        name: "",
        description: "",
    },
    vendor: {
        name: "",
        type: "",
    },
    pop: {
        name: "",
        owner: 0,
        extra_info: "",
    },
    address: {
        flat: "",
        floor: "",
        holding: "",
        street: "",
        area: "",
        thana: "",
        district: "",
        client_id: "",
        service_id: "",
        vendor_id: "",
        extra_info: "",
    },
    contact: {
        name: "",
        designation: "",
        type: "",
        phone1: "",
        phone2: "",
        phone3: "",
        email: "",
        client_id: 0,
        service_id: 0,
        vendor_id: 0,
    },
    accountManager: {
        client_id: 0,
        contact_id: 0,
        contact_name: "",
    },
    clientTypes: {
        name: "",
        description: "",
    },
});

export const vendorTypes = [
    {
        id: 1,
        type: "LSP",
    },
    {
        id: 2,
        type: "ISP",
    },
    {
        id: 3,
        type: "NTTN",
    },
];

export const contactTypes = [
    {
        id: 1,
        type: "Admin",
    },
    {
        id: 2,
        type: "Technical",
    },
    {
        id: 3,
        type: "Billing",
    },
    {
        id: 4,
        type: "Sales",
    },
];
