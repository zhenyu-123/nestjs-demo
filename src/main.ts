import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 启用版本控制
  // app.enableVersioning({
  //   type: VersioningType.URI, //curl http://localhost:3000/v1/api/user
  //   // type:VersioningType.HEADER,
  //   // header: 'Accept',// 发送带有 Accept 请求头的请求来测试不同版本的接口
  // });
  app.use(
    session({
      secret: 'XiaoMan',
      name: 'xm.session',
      rolling: true,
      cookie: { maxAge: null },
    }),
  );
  // 生成静态目录访问上传之后的图片   //http://localhost:3000/xiaoman/1729562587729.png
  app.useStaticAssets(join(__dirname, 'images'), {
    prefix: '/xiaoman',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
