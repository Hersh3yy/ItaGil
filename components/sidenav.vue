
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
                <p class="pt-8 text-gray-500 text-left text-2xl font-black mb-4 ml-4 cursor-pointer pb-8" 
                @click.prevent="$router.push('/news')"
                style="font-family: Arial;">
                    Itamar<br>
                    GilboA
                </p>

                <ul @click="$emit('navItemClicked')">
                    <li class="mb-4">
                        <NuxtLink to="/news" class="sidenav-item"
                            :class="{ 'text-gray-300': $route.path === '/news' }">News</NuxtLink>
                    </li>
                    <li class="mb-4">
                        <NuxtLink to="/projects" class="sidenav-item"
                            :class="{ 'text-gray-300': $route.path.startsWith('/projects') }">Projects</NuxtLink>
                    </li>
                    <li class="mb-4">
                        <NuxtLink to="/biography" class="sidenav-item"
                            :class="{ 'text-gray-300': $route.path === '/biography' }">Biography</NuxtLink>
                    </li>
                    <li class="mb-4">
                        <NuxtLink to="/contact" class="sidenav-item"
                            :class="{ 'text-gray-300': $route.path === '/contact' }">Contact</NuxtLink>
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
    }
}
</script>
<style>
@import url("//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css");
.sidenav-item {
@apply text-gray-500 hover:text-gray-700 block py-2 px-4 font-bold pb-4
}
</style>
