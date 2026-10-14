// Reads Itamar's content from VAMS and returns it in the Strapi shape the pages
// were written against ({ data: { id, attributes } }), so the templates stay as
// they are. Runs on the server so the VAMS API key never reaches the browser.
// Cached briefly: one VAMS call per type per minute, whatever the traffic.

const TYPES = ['ig-biography', 'news-articles', 'ig-projects', 'ig-landing-page-slideshow-images']

const toMedia = (images = []) => images.map((image, i) => ({
  id: i,
  attributes: {
    url: image.url,
    name: image.name || '',
    alternativeText: image.alt || null,
    width: image.width || null,
    height: image.height || null
  }
}))

const toStrapi = {
  'ig-biography': entry => ({
    Text: entry.content.text,
    Content: entry.content.content,
    Image: { data: toMedia(entry.content.image)[0] || null }
  }),
  'news-articles': entry => ({
    Title: entry.title,
    URL: entry.content.url || null,
    Order: entry.order,
    Images: { data: toMedia(entry.content.images) }
  }),
  'ig-projects': entry => ({
    Title: entry.title,
    slug: entry.content.slug,
    Text: entry.content.text,
    VideoLink: entry.content.video_link || null,
    Order: entry.order,
    Images: { data: toMedia(entry.content.images) }
  }),
  'ig-landing-page-slideshow-images': entry => ({
    Order: entry.order,
    Image: { data: toMedia(entry.content.image)[0] || null }
  })
}

export default defineCachedEventHandler(async (event) => {
  const type = getRouterParam(event, 'type')
  if (!TYPES.includes(type)) {
    throw createError({ statusCode: 404, statusMessage: `Unknown content type: ${type}` })
  }

  const { cmsBaseUrl, cmsApiKey } = useRuntimeConfig(event)
  const response = await $fetch(`${cmsBaseUrl}/api/entries/by-type/${type}`, {
    headers: { 'X-API-Key': cmsApiKey, Accept: 'application/json' }
  })

  const items = response.data.entries.map(entry => ({ id: entry.id, attributes: toStrapi[type](entry) }))

  // Strapi served the biography as a single object, everything else as a list.
  return { data: type === 'ig-biography' ? items[0] || null : items }
}, {
  maxAge: 60,
  swr: true,
  getKey: event => getRouterParam(event, 'type')
})
