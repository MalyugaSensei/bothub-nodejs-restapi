import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BooksService } from 'src/books/book.service';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { UpdateBookDto } from 'src/books/dto/update-book.dto';
import { UserRole } from 'src/users/roles';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { Book } from 'src/books/models/book.model';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) { }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        author: { type: 'string' },
        publicationDate: { type: 'string' },
        genres: { type: 'array', items: { type: 'string' } },
      }
    },
  })
  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          title: { type: 'string' },
          author: { type: 'string' },
          publicationDate: { type: 'string' },
          genres: { type: 'array', items: { type: 'string' } },
        }
      }
    },
  })
  @Public()
  @Get()
  async findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        author: { type: 'string' },
        publicationDate: { type: 'string' },
        genres: { type: 'array', items: { type: 'string' } },
      }
    },
  })
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        author: { type: 'string' },
        publicationDate: { type: 'string' },
        genres: { type: 'array', items: { type: 'string' } },
      }
    },
  })
  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookDto);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        msg: { type: 'string' },
      }
    },
  })
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.booksService.remove(id);
    return {
      msg: `Book deleted with id ${id} successfully`,
    };
  }
}
