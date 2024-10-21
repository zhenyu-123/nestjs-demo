import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
