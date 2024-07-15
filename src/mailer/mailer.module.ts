import { Module } from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
    providers: [MailerService],
})
export class MailerModule { };