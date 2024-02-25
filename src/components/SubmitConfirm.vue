<script setup>
    const props = defineProps({
        show: {
            type: Boolean,
            required: true,
        },
        actionName: {
            type: String,
            required: true,
        }
    });

    const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
    <div class="confirm" v-if="show">
        <div class="message" v-if="props.actionName === 'Add'">Are you sure you want to add?</div>
        <div class="message" v-if="props.actionName === 'Modify'">Are you sure you want to modify?</div>
        <div class="message" v-if="props.actionName === 'Delete'">Are you sure you want to delete?</div>
        <div class="button-section">
            <button @click="$emit('confirm')">Yes</button>
            <button @click="$emit('cancel')">No</button>
        </div>
    </div>
</template>
  
<style scoped>
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
