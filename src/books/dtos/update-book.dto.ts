import { Transform } from 'class-transformer';
import { IsString, Length, Min, Max, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class UpdateBookDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @IsNotEmpty()
  @IsNumber() 
  @Min(1)
  @Max(10)
  @Transform(({ value }) => {
    return value;
  })
  rating: number;

  @IsNotEmpty()
  @IsNumber() 
  @Min(1)
  @Max(1000)
  @Transform(({ value }) => {
    return value;
  })
  price: number;

  @IsNotEmpty()
  @IsUUID()
  authorId: string;

  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}