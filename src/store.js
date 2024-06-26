import { ref } from "vue";

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
        client_id: 0,
        service_id: 0,
        vendor_id: 0,
    },
    clientTypes: {
        name: "",
        description: "",
    },
});
