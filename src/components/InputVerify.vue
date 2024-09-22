<script setup>
    import { ref, onMounted } from "vue";
    import { callApi } from "../functions";

    const fieldInput = ref("");
    const props = defineProps({
        placeHolder: {
            type: String,
        },
        inputValue: {
            type: String,
            required: true,
        },
        apiResource: {
            type: Object,
            required: true,
        },
    });

    const emit = defineEmits(["processInput"]);

    onMounted(async () => {
        fieldInput.value = props.inputValue;
    });

    let timeout = null,
        match = false;
    const checkInput = () => {
        clearTimeout(timeout);
        if (fieldInput.value.length > 0) {
            timeout = setTimeout(async () => {
                const queryString = `${props.apiResource.queryParameter}=${fieldInput.value}`;
                try {
                    const results = await callApi("GET", props.apiResource.endpoint, queryString);
                    let match = false;
                    for (let result of results) {
                        if (result.name.toLowerCase() === fieldInput.value.toLowerCase()) {
                            match = true;
                            break;
                        }
                    }

                    if (match) {
                        emit("processInput");
                    } else {
                        emit("processInput", fieldInput.value);
                    }
                } catch (error) {
                    if (error.message === "Not Found") {
                        emit("processInput", fieldInput.value);
                    } else {
                        emit("processInput", fieldInput.value, error.message);
                    }
                }
            }, 1500);
        }
    };
</script>

<template>
    <input type="text" :placeholder="props.placeHolder" v-model="fieldInput" @input="checkInput()" />
</template>
