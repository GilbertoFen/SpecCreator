import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSpecDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(8000)
  description!: string;
}
