import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { DownloadService }from './download/download.service';
import { UserModule } from './user/user.module';
import { SessionController } from './session/session.controller';
import { UploadModule } from './upload/upload.module';
import { DownloadController } from './download/download.controller';
import { DownloadModule } from './download/download.module';



@Module({
  imports: [UserModule, UploadModule, DownloadModule],// 导入其他模块
  controllers: [AppController, UserController, SessionController, DownloadController],// 定义控制器
  providers: [AppService, UserService,DownloadService],// 定义服务和其他提供者
})
export class AppModule {}
