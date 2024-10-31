import { IsString, IsInt, Min, Max, IsNotEmpty } from 'class-validator';
export class CreateStudentDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  desc: string;
}
