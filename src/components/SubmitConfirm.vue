<template>
    <div class="modal" v-if="show">
        <span>Are you sure you want to modify?</span>
        <button @click="confirm">Confirm</button>
        <button @click="cancel">Cancel</button>
    </div>
</template>
  
<script setup>
    import { ref } from 'vue';

    defineProps({
        show: {
            type: Boolean,
            required: true,
        },
    });

    const emit = defineEmits(['confirm', 'cancel'])

    const confirm = () => {
        emit('confirm');
    };

    const cancel = () => {
        emit('cancel');
    };
</script>