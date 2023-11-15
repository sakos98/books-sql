// books.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Book } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateBookDTO } from './dtos/create-book.dto';


@Injectable()
export class BooksService {
  author: any;
  constructor(private prismaService: PrismaService) {}

  public async getAll(): Promise<any> {
    try {
      const books = await this.prismaService.book.findMany({
        include: {
          author: true,
          users: {
            select: { userId: true, likes: true },
          },
        },
      });
      return books;
    } catch (error) {
      throw new NotFoundException('Books not found');
    }
  }

  public getById(id: Book['id']): Promise<Book | null> {
    return this.prismaService.book.findUnique({
      where: { id },
    });
  }
 
  public async create(bookData: CreateBookDTO): Promise<Book> {
    try {
      const parsedRating = parseFloat(bookData.rating.toString());
      const parsedPrice = parseFloat(bookData.price.toString());
  
      if (isNaN(parsedRating) || isNaN(parsedPrice)) {
        throw new Error('Invalid number provided');
      }
  
      return await this.prismaService.book.create({
        data: {
          title: bookData.title,
          rating: parsedRating,
          price: parsedPrice,
          authorId: bookData.authorId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Name is already taken');
      }
      throw error;
    }
  }
  
  public async updateById(id: Book['id'], bookData: Partial<Book>): Promise<Book> {
    try {
      const { rating, price } = bookData;
      const parsedRating = parseFloat(rating.toString());
      const parsedPrice = parseFloat(price.toString());

      if (isNaN(parsedRating) || isNaN(parsedPrice)) {
        throw new Error('Invalid number provided');
      }

      return await this.prismaService.book.update({
        where: { id },
        data: {
          title: bookData.title,
          rating: parsedRating,
          price: parsedPrice,
        } as Prisma.BookUpdateInput,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Name is already taken');
      }
      throw error;
    }
  }

  public deleteById(id: Book['id']): Promise<Book> {
    return this.prismaService.book.delete({
      where: { id },
    });
  }

  async likeBook(bookId: string, userId: string): Promise<any> {
    try {
      const userOnBook = await this.prismaService.userOnBooks.findUnique({
        where: { bookId_userId: { bookId, userId } },
      });

      if (userOnBook) {
        return await this.prismaService.userOnBooks.update({
          where: { bookId_userId: { bookId, userId } },
          data: { likes: { increment: 1 } },
        });
      } else {
        return await this.prismaService.userOnBooks.create({
          data: { bookId, userId, likes: 1 },
        });
      }
    } catch (error) {
      throw new NotFoundException('Book or User not found');
    }
  }
}
