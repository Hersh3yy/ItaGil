# itamargilboa.com

Website for Amsterdam based artist Itamar Gilboa.
Currently available at https://starlit-figolla-325428.netlify.app/

## Project
The goal of this project is to create a clone of Itamar's existing website: http://itamargilboa.com
It is built with joomla and its software was last updated in 2012. Itamar currently has difficulty updating his content and asked for a website that looks like his but with a better way to update his content. He would also like to separate himself from GoDaddy, with whom his domain name is hosted till mid July.

### Current setup
- **Frontend** - Nuxt 3 is framework I chose to use as I am familiar with Nuxt 2 and wanted to experience the new release. Tailwind was the design system used - it allows the adding of css with built in classes for most situations allowing for faster development.
- **Backend** - I chose to use a prebuilt CMS called Strapi. I strive to keep it as updated as possible, currently on 4.10 (4.11 came out on 6/13). In order to add new content endpoints I need to run this locally, as changes to the api endpoints and their structure made via the admin panel add code changes that need to be committed to the repository. Data is stored on a postgresql database.
- **Hosting and deployment** - The frontend is currently hosted on netlify.com, which is a free (and great) provider for frontend applications. Netlify makes it extremely easy to host a frontend website by tracking its repository url and branch and the command needed to start it up. On a code push to the branch, a deploy is automatically started. The backend, database, and file storage are hosted on Digital Ocean. Similiar to the frontend, the backend app hosted on digital ocean is also tied to its git repository and gets deployed on code push.
- **Contact Form functionality** - The send mail function on the contact form calls a function that uses netlify's functions feature, which is like AWS lambda, which allows the calling of a javascript function, in this case it takes the mail message details as input and sends it to Itamar's email inbox, using SendGrid as the mail service.

### ToDo for MVP
- Contact form | design (button + mail sent! popup) + function (need to authenticate sender email on send-grid & spam filter)
- Projects page | Image gallery layout needs better responsiveness
- Secrets | Use the cloud providers' env variable functionality to store vars (which are currently public) 
- Error handling | Adding some typing and error handling when fetching data from the CMS
- July | Domain name administration


### Things to be added in v2
- Caching | When the website is live and has a larger audience, it would help to reduce the amount of API calls made to the backend and increase response speed of data fetching. I would most likely use a redis instance I would host and would need to add support for it in the nuxt project.
- Image optimization | To improve the speed of the site, either with a plugin or by instruction to the user, the size of the images used could use some lossless reducing. There are Strapi plugins that can help here.
- Testing | Although this is a simple website, some tests that could be added are end-to-end tests to assert the user experience and 




