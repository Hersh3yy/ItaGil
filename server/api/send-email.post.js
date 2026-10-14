import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate required fields
    if (!body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing request body'
      })
    }

    const mailMessage = body.mailMessage
    
    if (!mailMessage || !mailMessage.contactPerson || !mailMessage.contactEmail || !mailMessage.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: contactPerson, contactEmail, and message are required'
      })
    }

    // Validate email format
    const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/
    if (!emailRegex.test(mailMessage.contactEmail)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // Get Resend configuration from runtime config
    const config = useRuntimeConfig()
    const resendApiKey = config.resendApiKey
    const fromEmail = config.resendFromEmail
    const toEmail = config.resendToEmail

    if (!resendApiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Resend configuration not properly set up'
      })
    }

    // Initialize Resend
    const resend = new Resend(resendApiKey)

    // Generate professional email template
    const emailHtml = generateEmailTemplate({
      name: mailMessage.contactPerson.trim(),
      email: mailMessage.contactEmail.trim(),
      subject: mailMessage.subject || 'No subject',
      message: mailMessage.message.trim(),
      site: mailMessage.site || 'itamargilboa.com',
      timestamp: new Date().toISOString()
    })

    // Send email via Resend
    const emailData = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `Contact received from ${mailMessage.site} | Subject: ${mailMessage.subject}`,
      html: emailHtml,
      replyTo: mailMessage.contactEmail.trim()
    })

    if (!emailData.data?.id) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to send email - no email ID returned'
      })
    }

    console.log("Sent mail successfully!", emailData.data.id)
    
    return {
      success: true,
      message: 'Message sent successfully!',
      emailId: emailData.data.id
    }
    
  } catch (error) {
    console.log("Failed to send email:", error)
    
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send email. Please try again.'
    })
  }
})

// Professional email template generator
function generateEmailTemplate(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #d4af37; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: 600; color: #d4af37; display: block; margin-bottom: 5px; }
        .value { background: white; padding: 12px; border-radius: 4px; border-left: 4px solid #d4af37; }
        .message { background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #d4af37; white-space: pre-wrap; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .timestamp { color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>New Contact Form Submission</h1>
        <p>${escapeHtml(data.site)}</p>
      </div>
      
      <div class="content">
        <div class="field">
          <span class="label">Name:</span>
          <div class="value">${escapeHtml(data.name)}</div>
        </div>
        
        <div class="field">
          <span class="label">Email:</span>
          <div class="value">${escapeHtml(data.email)}</div>
        </div>
        
        <div class="field">
          <span class="label">Subject:</span>
          <div class="value">${escapeHtml(data.subject)}</div>
        </div>
        
        <div class="field">
          <span class="label">Message:</span>
          <div class="message">${escapeHtml(data.message)}</div>
        </div>
        
        <div class="footer">
          <p>This email was sent from the contact form on ${escapeHtml(data.site)}</p>
          <p class="timestamp">Received: ${new Date(data.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Simple HTML escaping function for server-side
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
