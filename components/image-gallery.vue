<template>
    <div class="grid w-full lg:w-1/2 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-1 2xl:gap-6 3xl:gap-8 auto-rows-min">
        <div v-for="(image, index) in imageLinks" :key="index" @click="expandImage(index)" class="relative cursor-pointer aspect-square">
            <img :src="image.attributes.url" :alt="image.attributes.name" class="absolute inset-0 w-full h-full object-cover rounded-lg pb-4 px-4 md:mx-0" />
        </div>
    </div>

    <div v-if="expandedImage" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center"
        @click="collapseImage" @keydown.left="previousImage" @keydown.right="nextImage">
        <div>
            <img :src="expandedImage.attributes.url" :alt="expandedImage.attributes.name"
                class="w-full h-auto object-cover" />
            <div class="absolute top-1/2 -mt-4 left-4 cursor-pointer" @click.stop="previousImage">
                <svg class="w-8 h-8 text-white" viewBox="0 0 24 24">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" />
                </svg>
            </div>
            <div class="absolute top-1/2 -mt-4 right-4 cursor-pointer" @click.stop="nextImage">
                <svg class="w-8 h-8 text-white" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="currentColor" />
                </svg>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        imageLinks: Array
    },
    data() {
        return {
            expandedImage: null,
            currentIndex: 0,
        };
    },
    mounted () {
        window.addEventListener('keydown', this.handleKeydown)
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.handleKeydown)
    },
    methods: {
        expandImage(index) {
            this.expandedImage = this.imageLinks[index]
            this.currentIndex = index;
        },
        collapseImage() {
            this.expandedImage = null
        },
        previousImage() {
            this.currentIndex = (this.currentIndex - 1 + this.imageLinks.length) % this.imageLinks.length;
            this.expandedImage = this.imageLinks[this.currentIndex];
        },
        nextImage() {
            this.currentIndex = (this.currentIndex + 1) % this.imageLinks.length;
            this.expandedImage = this.imageLinks[this.currentIndex];
        },
        handleKeydown(event) {
            if (this.expandedImage) {
                if (event.key === 'ArrowLeft' || event.key === 'Left') { // 'Left' for Internet Explorer
                    this.previousImage();
                } else if (event.key === 'ArrowRight' || event.key === 'Right') { // 'Right' for Internet Explorer
                    this.nextImage();
                } else if (event.key === 'Escape') {
                    this.collapseImage()
                }
            }
        }
    },
};
</script>