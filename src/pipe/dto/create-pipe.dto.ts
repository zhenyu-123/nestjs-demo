import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePipeDto {
  @IsNotEmpty() //验证是否为空
  @IsString() //是否为字符串
  @ApiProperty({ description: "姓名", example: "小满" }) //swagger文档描述
  name: string;

  @IsNotEmpty()
  age: number;
}
