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

    const confirm = () => {
        emit('confirm');
    };

    const cancel = () => {
        emit('cancel');
    };
</script>

<template>
    <div class="modal" v-if="show">
        <span v-if="props.actionName === 'add'">Are you sure you want to add?</span>
        <span v-if="props.actionName === 'modify'">Are you sure you want to modify?</span>
        <span v-if="props.actionName === 'delete'">Are you sure you want to delete?</span>
        <button @click="confirm">Confirm</button>
        <button @click="cancel">Cancel</button>
    </div>
</template>
  
