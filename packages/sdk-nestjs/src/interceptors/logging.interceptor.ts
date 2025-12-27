import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

/**
 * Interceptor for logging Exora API requests.
 * Useful for debugging and monitoring.
 */
@Injectable()
export class ExoraLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('ExoraSDK');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - now;
          this.logger.log(`${method} ${url} - ${duration}ms`);
        },
        error: (error) => {
          const duration = Date.now() - now;
          this.logger.error(
            `${method} ${url} - ${duration}ms - Error: ${error.message}`,
          );
        },
      }),
    );
  }
}
