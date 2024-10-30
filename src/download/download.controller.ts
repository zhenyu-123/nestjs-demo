import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { DownloadService } from './download.service';
import { CreateDownloadDto } from './dto/create-download.dto';
import { UpdateDownloadDto } from './dto/update-download.dto';
import type { Response } from 'express';
import { join } from 'path';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { zip } from 'compressing';

@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}
  @Post('album')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    console.log(file, 'file');
    return '峰峰35岁憋不住了';
  }
  @Get('export')
  downLoad(@Res() res: Response) {
    const url = join(__dirname, '../images/1730196788970.png');
    // res
    // console.log(url)
    res.download(url);
    // return  true
  }

  @Get('stream')
  async down(@Res() res: Response) {
    const url = join(__dirname, '../images/1730197779014.png');
    const tarStream = new zip.Stream();
    await tarStream.addEntry(url);

    res.setHeader('Content-Type', 'application/octet-stream');

    res.setHeader('Content-Disposition', `attachment; filename=xiaoman`);

    tarStream.pipe(res);
  }

  @Post()
  create(@Body() createDownloadDto: CreateDownloadDto) {
    return this.downloadService.create(createDownloadDto);
  }

  @Get()
  findAll() {
    return this.downloadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.downloadService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDownloadDto: UpdateDownloadDto,
  ) {
    return this.downloadService.update(+id, updateDownloadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.downloadService.remove(+id);
  }
}
