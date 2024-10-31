import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { DownloadService } from './download/download.service';
import { UserModule } from './user/user.module';
import { SessionController } from './session/session.controller';
import { UploadModule } from './upload/upload.module';
import { DownloadController } from './download/download.controller';
import { DownloadModule } from './download/download.module';
import { PipeModule } from './pipe/pipe.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    UserModule,
    UploadModule,
    DownloadModule,
    PipeModule,
    TypeOrmModule.forRoot({
      type: 'mysql', //数据库类型
      username: 'root', //账号
      password: '123456', //密码
      host: 'localhost', //host
      port: 3306, //
      database: 'nestdemo', //库名
      entities: [__dirname + '/**/*.entity{.ts,.js}'], //实体文件
      synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库
      retryDelay: 500, //重试连接数据库间隔
      retryAttempts: 10, //重试连接数据库的次数
      autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
    }),
    StudentModule,
  ], // 导入其他模块
  controllers: [
    AppController,
    UserController,
    SessionController,
    DownloadController,
  ], // 定义控制器
  providers: [AppService, UserService, DownloadService], // 定义服务和其他提供者
})
export class AppModule {}
