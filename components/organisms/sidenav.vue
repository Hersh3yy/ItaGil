
<template>
    <div>
        <!-- Sidebar -->
        <nav class="
            md:min-h-screen 
            bg-white 
            text-2xl text-gray-800 
            w-full md:w-64
            py-8 md:py-4 pl-14
            flex flex-col flex-shrink-0 justify-between" 
            :class="{ 'hidden': !showNav }">
            <div>
                <SiteLogo class="pt-8 text-gray-500 text-left text-2xl font-black mb-4 ml-4 pb-8"
                    style="font-family: Arial;" />

                <ul @click="$emit('navItemClicked')">
                    <li v-for="item in navItems" :key="item.to" class="mb-4">
                        <NavLink :to="item.to" :match-prefix="item.matchPrefix">{{ item.label }}</NavLink>
                    </li>
                </ul>
            </div>
            <footer>
                <div class="mb-6">
                    <SocialMediaIcons />
                </div>
                <span class="text-[9px] mt-3">Itamar Gilboa © All Rights Reserved</span>
            </footer>
        </nav>
        <div class="md:hidden w-full md:flex-1 px-4 py-8 md:py-4">
            <button class="text-gray-400 hover:text-gray-900 focus:text-red focus:outline-none"
                @click="$emit('navItemClicked')">
                <i class="fa fa-bars" style="font-size: 2rem;"></i>
                <div v-if="!showNav"  class="text-lg">Menu</div>
            </button>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        showNav: Boolean
    },
    data() {
        return {
            navItems: [
                { to: '/news', label: 'News' },
                { to: '/projects', label: 'Projects', matchPrefix: true },
                { to: '/biography', label: 'Biography' },
                { to: '/contact', label: 'Contact' }
            ]
        }
    }
}
</script>
<style>
@import url("//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css");
</style>
