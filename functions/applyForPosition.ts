import { Handler, Context, APIGatewayEvent } from "aws-lambda"
import mailgunjs = require('mailgun-js')
import * as fs from 'fs'
import { savePerson } from "./savePerson";

interface ApplicationData {
  email: string
  name: string
  coverLetter: string
  referringUser?: {
    id: string
    name: string
  }
  cvFile: {
    filename: string
    contentType: string
    dataUri: string
  }
}

exports.handler = async function(event: APIGatewayEvent, context: Context) {
  try {
    const application: ApplicationData = JSON.parse(event.body as string)

    const index = application.cvFile.dataUri.indexOf('base64,')
    const body64 = application.cvFile.dataUri.slice(index+'base64,'.length)
    const cvFileBuffer = Buffer.from(body64, 'base64')

    const domain = 'sandboxb0af8975de4c40dc8c69c2b398f0dd49.mailgun.org'
    const mailgun = mailgunjs({apiKey: process.env.MAILGUN_API_SECRET||"", domain: domain})

    const attachment = new mailgun.Attachment({ data: cvFileBuffer, filename: application.cvFile.filename, contentType: application.cvFile.contentType })
    const mail: mailgunjs.messages.SendData = {
      from: `${application.name} <postmaster@sandboxb0af8975de4c40dc8c69c2b398f0dd49.mailgun.org>`,
      to: 'misprime@gmail.com',
      subject: `Application from ${application.name}`,
      text: application.coverLetter + (application.referringUser ? `\n\nReferred by: ${application.referringUser.name} ${application.referringUser.id}` : `\n\nReferred by: none`),
      "h:Reply-To": application.email,
      attachment: attachment
    }

    await Promise.all([
      mailgun.messages().send(mail),
      savePerson({ name: application.name, email: application.email, referringUserId: application.referringUser ? application.referringUser.id : "none" })
    ])

    return { statusCode: 200, body: JSON.stringify({ success: true }) }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: err.toString() };
  }
};
