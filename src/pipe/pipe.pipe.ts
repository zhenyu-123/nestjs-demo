import {
  ArgumentMetadata,
  HttpException,
  Injectable,
  PipeTransform,
  HttpStatus,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
@Injectable()
export class PipePipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log(value);
    console.log(metadata);
    // value 就是 前端传过来的数据 metaData 就是元数据 通过 metatype 可以去实例化这个类=
    const DTO = plainToInstance(metadata.metatype, value);
    console.log(DTO, 'DTO');
    const errors = await validate(DTO);
    console.log(errors, 'errors');

    if (errors.length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    return value;
  }
}
