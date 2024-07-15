import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as cryptojs from 'crypto-js';
import * as nodemailer from 'nodemailer'
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { SendEmailDto } from 'src/mailer/dto/send-mail.dto';
import { User } from 'src/users/models/user.model';

@Injectable()
export class MailerService {
    cryptoKey: string = "1"
    constructor() { }
    mailTransport() {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || "smtp.mailtrap.io",
            port: +process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })

        return transporter
    }

    template(html: string, replacements: Record<string, string>) {
        return html
            .replace(
                /%(\w*)%/g,
                function (m, key) {
                    return replacements.hasOwnProperty(key) ? replacements[key] : "";
                }
            );
    }

    async encryptAES(data: string) {
        return cryptojs.AES.encrypt(data, this.cryptoKey).toString()
    }

    async decryptAES(data: string) {
        const decrypted = cryptojs.AES.decrypt(data.replace(/\s+/g, '+'), this.cryptoKey)
        if (decrypted) {
            return decrypted.toString(cryptojs.enc.Utf8)
        }
        else {
            return false
        }
    }



    async sendUserConfirmation(user: User): Promise<void> {
        const url = process.env.APP_BASE_URL + "users/confirm?access=" + await this.encryptAES(user.id.toString())

        this.sendEmail({
            text: `
            Здравствуйте, ${user.username}!
            Чтобы подтвердить вашу учетную запись пройдите по <a href="${url}"}">ссылке</a>`,
            subject: 'Please confirm your email',
            recipients: [{ name: user.username, address: user.email }],
        })
    }

    async sendEmail(data: SendEmailDto) {
        const transport = this.mailTransport()
        const html = data.placeholderReplacements
            ? this.template(data.text, data.placeholderReplacements)
            : data.text
        const options: MailOptions = {
            from: {
                name: process.env.APP_NAME,
                address: process.env.APP_EMAIL
            },
            to: data.recipients,
            subject: data.subject,
            html,
        }

        try {
            const result = await transport.sendMail(options)
        } catch (error) {
            console.log('Error: ', error)
            throw new InternalServerErrorException("Something went wrong")
        }
    }
}
