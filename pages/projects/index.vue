<template>
    <div>
            <NuxtLink v-for="(project, i) in sortedApiProjects" :to="`/projects/${project.attributes.slug}`">
                <div class="text-2xl text-gray-800 hover:text-gray-400 mb-8">{{ project.attributes.Title }}</div>
            </NuxtLink>
    </div>
</template>
<script>
import partition from 'lodash/partition'
export default {
    data() {
        return {
            apiProjects: []
        }
    },
    computed: {
        sortedApiProjects() {
            if (this.apiProjects.length > 0) {
                const [bob, alice] = partition(this.apiProjects, (o) => {
                    return !o.attributes.Order || o.attributes.Order === "";
                })
                alice.sort((a, b) => b.attributes.Order - a.attributes.Order);
                return [...alice, ...bob];
            }
            return [];
        }
    },
    mounted() {
        const cms = useRuntimeConfig().public.cmsBaseUrl
        $fetch(`${cms}/api/ig-projects?populate=*`).then((response) => {
            this.apiProjects = response.data
        })
    }
}
</script>