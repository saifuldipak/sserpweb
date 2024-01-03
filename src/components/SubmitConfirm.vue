<template>
    <div class="modal" v-if="show">
        <span v-if="props.actionType === 'modify'">Are you sure you want to modify?</span>
        <span v-if="props.actionType === 'delete'">Are you sure you want to delete?</span>
        <button @click="confirm">Confirm</button>
        <button @click="cancel">Cancel</button>
    </div>
</template>
  
<script setup>
    import { ref } from 'vue';

    const props = defineProps({
        show: {
            type: Boolean,
            required: true,
        },
        actionType: {
            type: String,
            required: true,
        }
    });

    const emit = defineEmits(['confirm', 'cancel'])

    const confirm = () => {
        emit('confirm');
    };

    const cancel = () => {
        emit('cancel');
    };
</script>