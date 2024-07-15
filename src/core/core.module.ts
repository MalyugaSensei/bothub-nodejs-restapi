import { Module } from '@nestjs/common';
import { BooksModule } from 'src/books/book.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { UsersModule } from 'src/users/user.module';

@Module({
    imports: [BooksModule, UsersModule, MailerModule],
    exports: [BooksModule, UsersModule, MailerModule]
})
export class CoreModule { };