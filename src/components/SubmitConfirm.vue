<script setup>
    const props = defineProps({
        /* show: {
            type: Boolean,
            required: true,
        }, */
        actionName: {
            type: String,
            required: true,
        },
        itemName: {
            type: String,
        },
    });

    const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
    <div class="confirm-message-box">
        <div class="message" v-if="props.actionName === 'Add'">Are you sure you want to add "{{ props.itemName }}" ?</div>
        <div class="message" v-if="props.actionName === 'Edit'">Are you sure you want to modify "{{ props.itemName }}" ?</div>
        <div class="message" v-if="props.actionName === 'Delete'">Are you sure you want to delete "{{ props.itemName }}" ?</div>
        <div class="button-section">
            <button @click="$emit('confirm')">Yes</button>
            <button @click="$emit('cancel')">No</button>
        </div>
    </div>
</template>

<style scoped>
    .confirm-message-box {
        width: 100%;
        position: absolute;
        z-index: 1000;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgb(255, 255, 198);
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
        border-radius: 5px;
        padding: 10px;
    }
    .confirm {
        display: flex;
        flex-direction: column;
        text-align: center;
    }

    .message {
        align-items: center;
    }

    .button-section {
        display: flex;
        justify-content: center;
    }
</style>
