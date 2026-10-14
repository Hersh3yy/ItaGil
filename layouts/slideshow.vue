<template>
    <div class="relative">
        <LandingSlideshow class="cursor-pointer"/>
    </div>
    <div class="absolute bottom-0 left-4 mb-4 mr-4 z-10 cursor-pointer">
        <SiteLogo class="logo-ita" />
    </div>
</template>
<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

.font-open-sans {
  font-family: 'Open Sans', sans-serif;
}

.logo-ita {
    text-shadow: 2px 2px 9px #444;
    @apply text-white text-left text-2xl font-extrabold absolute bottom-0 left-0 mb-4 ml-4
}
</style>