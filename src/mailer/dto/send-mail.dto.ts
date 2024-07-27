import { Address } from 'nodemailer/lib/mailer';

export type SendEmailDto = {
  subject: string;
  recipients: Address[];
  text: string;
  placeholderReplacements?: Record<string, string>;
};
