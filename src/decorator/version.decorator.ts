import { createParamDecorator, ExecutionContext, applyDecorators, UseInterceptors, CallHandler, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 创建一个参数装饰器来获取版本号
export const ApiVersion = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['api-version'] || 'v1';
  },
);

// 创建一个方法装饰器来处理版本控制
export function VersionedRoute(version: string) {
  return applyDecorators(
    UseInterceptors(VersionInterceptor(version)),
  );
}

// 创建一个拦截器来处理版本控制逻辑
function VersionInterceptor(version: string): NestInterceptor {
  return {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const requestVersion = request.headers['api-version'] || 'v1';

      if (requestVersion === version) {
        return next.handle();
      } else {
        return next.handle().pipe(
          map(() => ({
            statusCode: 404,
            message: `Version ${requestVersion} is not supported for this route`,
          })),
        );
      }
    },
  };
}