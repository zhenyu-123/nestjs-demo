import { Injectable, NestInterceptor, CallHandler } from '@nestjs/common'
import { map } from 'rxjs/operators'
import {Observable} from 'rxjs'
 
 
 
interface data<T>{
    data:T
}
 
@Injectable() // 装饰器，将类注册为可注入的依赖项 （服务） ，使其可用于依赖注入系统。 它还将类标记为提供者，这意味着它可以被注入到其他类中。 
export class Response<T = any> implements NestInterceptor {
    intercept(context, next: CallHandler):Observable<data<T>> {
        return next.handle().pipe(map(data => {
            return {
               data,
               status:0,
               success:true,
               message:"牛逼"
            }
        }))
    }
}