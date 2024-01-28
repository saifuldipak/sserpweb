<script setup>
    const props = defineProps({
        addresses: Array
    })
</script>
<template>
    <ul v-for="address in props.addresses" :key="address.id">
        <li>Flat: {{ address.flat }}</li>
        <li>Floor: {{ address.floor }}</li>
        <li>Holding: {{ address.holding }}</li>
        <li>Street: {{ address.street }}</li>
        <li>Area: {{ address.area }}</li>
        <li>Thana: {{ address.thana }}</li>
        <li>District: {{ address.district }}</li>
    </ul>
</template>