import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Query,
  Headers,
  HttpCode,
  Res,
  Req,
} from '@nestjs/common';

import * as svgCaptcha from 'svg-captcha';
@Controller('session')
export class SessionController {
  @Get('code')
  createCaptcha(@Req() req, @Res() res) {
    console.log('res', req);
    const captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: '#cc9966', //背景颜色
    });
    req.session.code = captcha.text; //存储验证码记录到session
    res.type('image/svg+xml');
    res.send(captcha.data);
  }

  @Post('create')
  createUser(@Req() req, @Body() body) {
    console.log(req.session.code, body);
    if (
      req.session.code.toLocaleLowerCase() ===
      body?.imgCode?.toLocaleLowerCase()
    ) {
      return {
        code: 200,
        msg: '验证码正确',
      };
    } else {
      return {
        code: '400',
        msg: '验证码错误',
      };
    }
  }
  @Get('get')
  getSession(@Req() req) {
    console.log(req.session);
    return {
      message: '200',
    };
  }
}
