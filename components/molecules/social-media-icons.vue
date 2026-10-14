<template>
    <div class="flex flex-row text-lg">
        <a v-for="link in links" :key="link.title" :href="link.href" :title="link.title" target="_blank">
            <img class="social-icon-image" :src="link.icon" :alt="`${link.title} icon`" />
        </a>
    </div>
</template>
<script setup>
import instagram from '~/assets/social-icons/instagram.svg'
import linkedin from '~/assets/social-icons/linkedin.svg'
import vimeo from '~/assets/social-icons/vimeo.svg'
import facebook from '~/assets/social-icons/facebook.svg'

const links = [
    { title: 'Instagram', href: 'https://instagram.com/itamargilboa/', icon: instagram },
    { title: 'LinkedIn', href: 'http://nl.linkedin.com/pub/itamar-gilboa/16/b22/7a3', icon: linkedin },
    { title: 'Vimeo', href: 'https://vimeo.com/user4537372', icon: vimeo },
    { title: 'Facebook', href: 'https://www.facebook.com/igilboa', icon: facebook }
]
</script>
<style>
.social-icon-image {
    @apply w-8 mx-1
}
</style>
