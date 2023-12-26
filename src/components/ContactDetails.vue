<script setup>
    const props = defineProps({
        contacts: Array
    })
</script>

<template>
    <ul v-for="contact in props.contacts" :key="contact.id">
        <li>Name: {{ contact.name }} </li>
        <li>Designation: {{ contact.designation }}</li>
        <li>Contact Type: {{ contact.type }}</li>
        <li>Phone1: {{ contact.phone1 }}</li>
        <li v-if="contact.phone2">Phone1: {{ contact.phone2 }}</li>
        <li v-if="contact.phone3">Phone3: {{ contact.phone3 }}</li>
    </ul>
</template>