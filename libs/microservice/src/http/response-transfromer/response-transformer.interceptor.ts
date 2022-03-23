import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Statuses } from '@app/core/framework/exceptions/exception.enum';

export interface Response<T> {
  status: Statuses;
  data: T;
}

@Injectable()
export class ResponseTransformerInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  private readonly excludeRoutePrefixes: string[];

  constructor(excludeRoutePrefixes: string[]) {
    this.excludeRoutePrefixes = excludeRoutePrefixes;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const url = context.switchToHttp()?.getRequest()?.url;
    for (const pathPrefix of this.excludeRoutePrefixes) {
      if (url.startsWith(pathPrefix)) {
        return next.handle();
      }
    }

    return next.handle().pipe(
      map((data) => ({
        data: data ? data : {},
        status: Statuses.Succeed,
      })),
    );
  }
}
