// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/main.css'],

  postcss: {
      plugins: {
          tailwindcss: {},
          autoprefixer: {},
      },
  },

  app: {
      head: {
          title: 'Itamar Gilboa - Artist',
          link: [{ rel: 'icon', type: 'image/png', href: '/IG.png' }],
          htmlAttrs: {
              lang: 'en'
          },
          meta: [
              {
                  name: 'description',
                  content: 'Web page for Itamar Gilboa - Artist'
              },
              {
                  name: 'keywords',
                  content: 'amsterdam, art'
              }
          ],
          script: [
              {
                  src: 'https://cloud.umami.is/script.js',
                  'data-website-id': '401efe1a-859a-47ba-9b5c-0f62dbae4bb6',
                  defer: true
              }
          ]
      }
  },

  modules: [
      '@nuxtjs/eslint-module'
  ],

  runtimeConfig: {
      // Private keys (only available on server-side)
      resendApiKey: process.env.RESEND_API_KEY,
      resendFromEmail: process.env.RESEND_FROM_EMAIL || 'gilboaitamar@gmail.com',
      resendToEmail: process.env.RESEND_TO_EMAIL || 'gilboaitamar@gmail.com',
      // Public keys (exposed to client-side)
      public: {
          gtagId: 'G-EDC8N050NM',
          // CMS base URL. Defaults to the live Strapi on DigitalOcean so the site
          // works unchanged. Override with NUXT_PUBLIC_CMS_BASE_URL to point the
          // whole app at VAMS (once VAMS holds Itamar's content — see .env.example).
          cmsBaseUrl: process.env.NUXT_PUBLIC_CMS_BASE_URL || 'https://hiren-devs-strapi-j5h2f.ondigitalocean.app'
      }
  },

  compatibilityDate: '2025-09-27'
})