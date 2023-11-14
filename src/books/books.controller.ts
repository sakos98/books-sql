import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private bookService: BooksService) { }

  @Get('/')
  getAll() {
    return this.bookService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const book = await this.bookService.getById(id);
    if (!book) throw new NotFoundException('Author not found');
    return book;
  }

  @Post('/')
  create(@Body() bookData: Partial<CreateBookDTO>) {
    return this.bookService.create(bookData as CreateBookDTO);
  }

  @Put('/:id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() bookData: Partial<UpdateBookDTO>,
  ) {
    if (!(await this.bookService.getById(id)))
      throw new NotFoundException('Author not found');
    await this.bookService.updateById(id, bookData);
    return { success: true };
  }


  @Delete('/:id')
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.bookService.getById(id)))
      throw new NotFoundException('Book not found');
    await this.bookService.deleteById(id);
    return { success: true };
  }
}
