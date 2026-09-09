<template>
    <section class="content-between flex flex-col">
        <form @submit.prevent="submitContactForm" v-if="!mailSent">
            <input type="text" v-model="contactFormName" class="form-input" placeholder="Name" required />
            <input type="email" v-model="contactFormEmail" class="form-input" placeholder="Email address" required />
            <input type="text" v-model="contactFormSubject" class="form-input" placeholder="Subject" required />
            <textarea class="form-input" rows="5" placeholder="Message" v-model="contactFormMessage" required />
            <button type="submit"
                class="text-white bg-black font-medium rounded-sm text-sm px-5 py-2.5 text-center mr-2 mb-2 ">
                Submit
            </button>
            <button @click="$emit('contactFormModalToggle')" class="btn-primary mb-5">
                Close
            </button>
        </form>
        <div class="flex flex-col items-center pb-12 px-3 mx-4" v-else>
            <h2 class="pt-4 mb-8">Thank you for your mail!</h2>
            <h3>I will get back to you as soon as we can.</h3>
            <br>
            <button @click="mailSent = false" class="btn-primary mb-5">
                Close
            </button>
        </div>
    </section>
</template>
<script setup>
import { ref } from 'vue'
const contactFormName = ref("")
const contactFormEmail = ref("")
const contactFormMessage = ref("")
const contactFormSubject = ref("")
const mailSent = ref(false)
async function submitContactForm() {
    let mailMessage = {
        site: "itamargilboa.com",
        message: contactFormMessage.value,
        contactPerson: contactFormName.value,
        contactEmail: contactFormEmail.value,
        subject: contactFormSubject.value
    }

    await $fetch('/api/send-email', {
        method: 'POST',
        body: {
            mailMessage
        }
    })
        .then(res => console.log(res))
        .then(() => {
            contactFormEmail.value = ""
            contactFormMessage.value = ""
            contactFormName.value = ""
            mailSent.value = true
        })
        .catch(error => console.log(error))
}
</script>
<style>
.form-input {
    @apply block w-full px-3 py-1.5 text-base mb-6 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-black focus:outline-none font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
}
</style>