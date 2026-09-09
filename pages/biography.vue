<template>
    <div class="flex flex-col lg:flex-row justify-center items-center lg:items-start">
        <div class="pb-[5%] overflow-hidden max-w-xs lg:mr-10 grow">
            <img :src="biographyImage" />
        </div>
        <div class="text-left break-words whitespace-pre-wrap lg:w-3/4 lg:max-w-2xl lg:pr-7" v-html="biographyText" />
    </div>
</template>
<script>
export default {
    data() {
        return {
            biographyText: "",
            biographyImage: ""
        }
    },
    mounted() {
        const cms = useRuntimeConfig().public.cmsBaseUrl
        $fetch(`${cms}/api/ig-biography?populate=*`).then((response) => {
            this.biographyText = this.parseText(response.data.attributes.Text)
            this.biographyImage = response.data.attributes.Image.data.attributes.url
        })
    },
    methods: {
        parseText(tekst) {
            let parsed = tekst
            parsed = parsed.replace(/\[([^[]+)\]\(([^()]+)\)/g, '<a href="$2" class="underline py-3">$1</a>');;

            // Replace ### with <h3> tag
            parsed = parsed.replace(/###\s(.+)$/gm, '<h3>$1</h3>')

            // Replace **text** with <strong> tag
            parsed = parsed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

            return parsed
        }
    }
}
</script>