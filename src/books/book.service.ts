import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { UpdateBookDto } from 'src/books/dto/update-book.dto';
import { Book } from 'src/books/models/book.model';

@Injectable()
export class BooksService {
    constructor(
        @InjectModel(Book)
        private bookModel: typeof Book
    ) { }
    async create(book: CreateBookDto): Promise<Book> {
        return this.bookModel.create(book)
    }

    async findAll(): Promise<Book[]> {
        return this.bookModel.findAll()
    }

    async findOne(id: string): Promise<Book> {
        return this.bookModel.findByPk(id)
    }

    async update(id: string, book: UpdateBookDto): Promise<Book> {
        return this.bookModel.update(book, { where: { id }, returning: true }).then(([_, book]) => book[0])
    }

    async remove(id: string): Promise<void> {
        await this.bookModel.destroy({ where: { id } })
    }

}
