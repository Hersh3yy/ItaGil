<template>
    <NuxtLink :to="to" class="sidenav-item" :class="{ 'text-gray-300': active }">
        <slot />
    </NuxtLink>
</template>
<script setup>
const props = defineProps({
    to: { type: String, required: true },
    // Also highlight on sub-routes, e.g. /projects/food-chain-project
    matchPrefix: Boolean
})
const route = useRoute()
const active = computed(() => props.matchPrefix ? route.path.startsWith(props.to) : route.path === props.to)
</script>
<style>
.sidenav-item {
@apply text-gray-500 hover:text-gray-700 block py-2 px-4 font-bold pb-4
}
</style>
