<script setup>
    import { ref, onMounted } from 'vue';

    const searchArgument1 = ref({})
    const searchArgument2 = ref({})
    const searchArgument3 = ref({})
    const props = defineProps({
        viewName: {
            type: String,
            required: true
        }
    })
    const emit = defineEmits(['closeHelpMessage'])

    onMounted(() => {
        if (props.viewName === 'Clients') {
            searchArgument1.value.heading = 'Search by client name'
            searchArgument1.value.example = 'type "exim" or "ific" or "city" etc.'
            searchArgument2.value.heading = 'Search by client type'
            searchArgument2.value.example = 'type "client_type:bank" or "client_type:nbfi"'
            searchArgument3.value.heading = 'Search by client name and client type'
            searchArgument3.value.example = 'type "client_name:exim client_type:bank"'
        }
        else if (props.viewName === 'Services') {
            searchArgument1.value.heading = 'Search by service point'
            searchArgument1.value.example = 'type full or partial service point name'
            searchArgument2.value.heading = 'Search by client name'
            searchArgument2.value.example = 'type "client_name:rupali"'
            searchArgument3.value.heading = 'Search by service point and client name'
            searchArgument3.value.example = 'type "service_point:dilkusha client_name:exim'
        }
    })
</script>
<template>
    <div class="help-message-container">
        <div class="help-message">
            <div class="heading">
                <div class="heading">Help</div>
                <a href="#" @click="$emit('closeHelpMessage')"><span class="material-symbols-outlined">
                        close
                    </span></a>
            </div>
            <div class="message">
                <div class="topic">{{ searchArgument1.heading }}</div>
                <div>{{ searchArgument1.example }}</div>
                <div>&nbsp</div>
                <div class="topic">{{ searchArgument2.heading }}</div>
                <div>{{ searchArgument2.example }}</div>
                <div>&nbsp</div>
                <div class="topic">{{ searchArgument3.heading }}</div>
                <div>{{ searchArgument3.example }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .help-message-container {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }

    .help-message {
        display: flex;
        z-index: 1000;
        opacity: 90%;
        overflow: auto;
        position: fixed;
        flex-direction: column;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
        border-radius: 10px;
        padding: 10px;
        background-color: antiquewhite;
    }

    .heading {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .message {
        display: flex;
        background-color: antiquewhite;
        flex-direction: column;
        justify-content: flex-start;
    }

    .heading {
        font-size: larger;
        font-weight: bold;
    }

    .topic {
        font-size: medium;
        font-weight: bold;
    }
</style>