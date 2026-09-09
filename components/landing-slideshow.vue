<template>
  <div class="flex items-center justify-center h-screen relative">
    <button @click="previousSlide"
      class="absolute top-1/2 transform -translate-y-1/2 left-4 bg-white bg-opacity-50 p-2 border-none cursor-pointer z-10"><i
        class="fa fa-chevron-left" style="font-size: 2rem;"></i></button>
    <div v-for="(image, index) in apiSlides" :key="index"
      class="absolute w-full h-full duration-700 transition-opacity ease-in-out"
      :class="{ 'opacity-0': index !== currentIndex }">
      <img :src="image.attributes.Image.data.attributes.url" alt="Slide Image" class="object-cover w-full h-full"
        @click.prevent="$router.push('/news')">
    </div>

    <button @click="nextSlide"
      class="absolute top-1/2 transform -translate-y-1/2 right-4 bg-white bg-opacity-50 p-2 border-none cursor-pointer"><i
        class="fa fa-chevron-right" style="font-size: 2rem;"></i></button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      images: [],
      currentIndex: 0,
      timer: null,
      apiSlides: [
        {
          attributes: {
            Image: {
              data: {
                attributes: {
                  url: 'https://bengijzel.ams3.digitaloceanspaces.com/hiren-devs-strapi/c4b38a10f54e45477646f2fda7c87fa2.jpg'
                }
              }
            }
          }
        },
        {
          attributes: {
            Image: {
              data: {
                attributes: {
                  url: 'https://bengijzel.ams3.digitaloceanspaces.com/hiren-devs-strapi/228532ea9fa688d9db7294b559abdeca.jpg'
                }
              }
            }
          }
        }
      ],
    };
  },
  computed: {
    sortedApiSlides() {
      if (this.apiSlides.length > 0) {
        const [bob, alice] = partition(this.apiSlides, (o) => {
          return !o.Order || o.Order === "";
        })
        alice.sort((a, b) => a.attributes.Order - b.attributes.Order);

        return [...alice, ...bob];
      }
      return [];
    }
  },
  mounted() {
    // Fetch images from the API and populate the `images` array
    this.fetchImages();

    // Start the timer to increment the slide every 2 seconds
    this.timer = setInterval(this.nextSlide, 4400);
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    // Clear the timer to avoid memory leaks
    clearInterval(this.timer)
    window.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    fetchImages() {
      const cms = useRuntimeConfig().public.cmsBaseUrl
      $fetch(`${cms}/api/ig-landing-page-slideshow-images?populate=*`).then((response) => {
        this.apiSlides = response.data
      })
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.apiSlides.length;
    },
    previousSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.apiSlides.length) % this.apiSlides.length;
    },
    handleKeydown(event) {
      if (event.key === 'ArrowLeft' || event.key === 'Left') { // 'Left' for Internet Explorer
        this.previousSlide();
      } else if (event.key === 'ArrowRight' || event.key === 'Right') { // 'Right' for Internet Explorer
        this.nextSlide();
      }
    }
  },
};
</script>
<style>@import url("//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css");</style>