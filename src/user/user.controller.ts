import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VersionedRoute } from '../decorator/version.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';

@Controller({
  path: 'user',
})
@ApiTags('用户')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户', description: '创建用户' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Version('1')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  // @VersionedRoute('v1') // 自定义装饰器
  @ApiParam({name:"id",description:"用户id",required:true})
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
