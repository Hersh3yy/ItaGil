<template>
    <div>
        <div v-for="(article, i) in sortedApiNewsArticles" :key="i" class="max-w-[820px] pb-10">
            <div>
                <a v-if="article.attributes.URL" :href="article.attributes.URL" target="_blank"
                    class="text-gray-500 text-xl underline">
                    {{ article.attributes.Title }}
                </a>
                <div v-else class="text-gray-500 text-xl">
                    {{ article.attributes.Title }}
                </div>
            </div>
            <div v-for="(image, i) in article.attributes.Images.data">`
                <img :src="image.attributes.url" class="pt-2" />
            </div>
            <br />
            <hr />
        </div>
    </div>
</template>
<script>
import partition from 'lodash/partition'
export default {
    data() {
        return {
            apiNewsArticles: []
        }
    },
    computed: {
        sortedApiNewsArticles() {
            if (!this.apiNewsArticles || !Array.isArray(this.apiNewsArticles) || this.apiNewsArticles.length === 0) {
                return [];
            }

            const [bob, alice] = partition(this.apiNewsArticles, (o) => {
                if (!o.attributes) {
                    return true;
                }
                return !o.attributes.Order || o.attributes.Order === "";
            });

            alice.sort((a, b) => {
                // Convert to integers for sorting, in case they are not
                const orderA = parseInt(a.attributes.Order, 10);
                const orderB = parseInt(b.attributes.Order, 10);
                return orderA - orderB;  // For descending order
            });

            return [...alice, ...bob];
        }
    },
    mounted() {
        $fetch('/api/cms/news-articles').then((response) => {
            this.apiNewsArticles = response.data
        })
    }
}
</script>