import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerGlobalInterceptor implements NestInterceptor {
  intercept(contexto: ExecutionContext, next: CallHandler): Observable<any> {
    const contextoHttp = contexto.switchToHttp();

    const requisicao = contextoHttp.getRequest<Request>();
    const resposta = contextoHttp.getResponse<Response>();

    const { path, method } = requisicao;
    const { statusCode } = resposta;

    const instantePreControlador = Date.now();

    return next.handle().pipe(
      tap(() => {
        const tempoPassado = Date.now() - instantePreControlador;

        console.log(`${method} ${path} (${statusCode}) - ${tempoPassado}ms`);
      }),
    );
  }
}
