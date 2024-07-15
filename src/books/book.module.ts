import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BooksController } from 'src/books/book.controller';
import { Book } from 'src/books/models/book.model';
import { BooksService } from 'src/books/book.service';

@Module({
    imports: [SequelizeModule.forFeature([Book])],
    controllers: [BooksController],
    providers: [BooksService],
})

export class BooksModule { }
