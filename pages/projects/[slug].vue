<template>
    <div v-if="apiProject" class="max-w-screen-2xl">
        <div class="text-bold text-center text-2xl pl-4 pb-4">{{ projectTitle }}</div>
        <div class="flex flex-col lg:flex-row-reverse">
            <div class="lg:w-1/2 min-w-fit lg:ml-5">
                <iframe v-if="projectVideo" class="mb-8" :src="youtubeVideo || vimeoVideo || projectVideo" width="500" height="281" allowfullscreen="allowfullscreen" />
                <div class="break-words whitespace-pre-wrap max-w-lg mb-8" v-html="projectText" />
            </div>
            <image-gallery class="lg:w-1/2 pt-16 md:pt-0" :image-links="projectImages" />
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            apiProject: {}
        }
    },
    computed: {
        projectText() {
            return this.apiProject?.attributes?.Text ? this.parseText(this.apiProject.attributes.Text) : ""
        },
        projectImages() {
            return this.apiProject?.attributes?.Images?.data || []
        },
        projectTitle() {
            return this.apiProject?.attributes?.Title || ""
        },
        projectVideo() {
            let videoLink = this.apiProject?.attributes?.VideoLink || ""
            // if Youtube video provided
            if (videoLink.includes('youtube.com') || videoLink.includes('youtu.be')) {
                const videoId = videoLink.match(/(?:youtube\.com\/watch\?v=|youtu.be\/)([^&\s]+)/);
                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId[1]}`
                }
            }

            // if Vimeo link provided
            const vimeoRegex = /https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/;
            const match = videoLink.match(vimeoRegex);
            if (match) {
                const videoId = match[1];
                return `https://player.vimeo.com/video/${videoId}`;
            }

            return false
        },
    },
    mounted() {
        const cms = useRuntimeConfig().public.cmsBaseUrl
        const apiEndpoint = `${cms}/api/ig-projects?filters\[slug\][$eq]=${this.$route.params.slug}&populate=*`
        $fetch(apiEndpoint).then((response) => {
            this.apiProject = response.data[0]
        })
    },
    methods: {
        parseText(tekst) {
            let parsed = tekst
            parsed = parsed.replace(/\[([^[]+)\]\(([^()]+)\)/g, '<a href="$2" class="underline">$1</a>');;

            // Replace ### with <h3> tag
            parsed = parsed.replace(/###\s(.+)$/gm, '<h3 class="text-bold">$1</h3>')

            // Replace **text** with <strong> tag
            parsed = parsed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

            return parsed
        }
    }
}
</script>