<template>
    <div class="flex flex-col md:flex-row md:min-h-screen font-carrois pb-4">
        <Sidenav :showNav="showNav" @navItemClicked="hideNavOnMobile" class="md:fixed md:left-0 md:top-0 md:h-screen bg-gray-200"/>
        <div class="flex-grow px-4 pr-3 md:ml-80 mt-12 md:mt-[3.25rem]">
          <slot />
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      showNav: false
    }
  },
  mounted() {
        if (window.innerWidth > 768) {
            this.showNav = true
        }
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        handleResize() {
            if (window.innerWidth > 768) {
                this.showNav = true;
            }
        },
        hideNavOnMobile() {
          if (window.innerWidth < 768) {
            this.showNav = !this.showNav
          }
        }
    }
}
</script>
<style>
@import url('https://fonts.googleapis.com/css?family=Carrois+Gothic');

.font-carrois {
  font-family: 'Carrois Gothic', Arial;
  color: #333
}
</style>