import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import { Response } from './common/response';
import { HttpFilter } from './common/filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  app.useGlobalInterceptors(new Response()); // 全局相响应拦截器
  app.useGlobalFilters(new HttpFilter()); // 全局异常过滤器

  const options = new DocumentBuilder()
    .setTitle('小满接口文档')
    .setDescription('描述，。。。')
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
