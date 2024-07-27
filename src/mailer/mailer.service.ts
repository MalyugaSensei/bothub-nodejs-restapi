import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { CryptoUtil } from 'src/common/utils/crypto.util';
import { SendEmailDto } from 'src/mailer/dto/send-mail.dto';
import { User } from 'src/users/models/user.model';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  constructor() {}
  mailTransport() {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
      port: +process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    return transporter;
  }

  template(html: string, replacements: Record<string, string>) {
    return html.replace(/%(\w*)%/g, function (m, key) {
      return replacements.hasOwnProperty(key) ? replacements[key] : '';
    });
  }

  async sendUserConfirmation(user: User): Promise<void> {
    const url =
      process.env.APP_BASE_URL +
      'users/confirm?access=' +
      (await CryptoUtil.encryptAES(user.id.toString()));

    this.sendEmail({
      text: `
            Здравствуйте, ${user.username}!
            Чтобы подтвердить вашу учетную запись пройдите по <a href="${url}"}">ссылке</a>`,
      subject: 'Please confirm your email',
      recipients: [{ name: user.username, address: user.email }],
    });
  }

  async sendEmail(data: SendEmailDto) {
    const transport = this.mailTransport();
    const html = data.placeholderReplacements
      ? this.template(data.text, data.placeholderReplacements)
      : data.text;
    const options: MailOptions = {
      from: {
        name: process.env.APP_NAME,
        address: process.env.APP_EMAIL,
      },
      to: data.recipients,
      subject: data.subject,
      html,
    };

    try {
      return await transport.sendMail(options);
    } catch (error) {
      this.logger.log('Error: ', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
