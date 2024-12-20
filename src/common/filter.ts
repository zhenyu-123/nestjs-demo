 
import { ExceptionFilter, Catch, ArgumentsHost,HttpException } from '@nestjs/common'
 
import {Request,Response} from 'express'
//  异常拦截器
@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
    catch(exception:HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const request = ctx.getRequest<Request>()
        const response = ctx.getResponse<Response>()
 
        const status = exception.getStatus()
 
        response.status(status).json({
           data:exception.message,
           time:new Date().getTime(),
           success:false,
           path:request.url,
           status
        })
    }
}