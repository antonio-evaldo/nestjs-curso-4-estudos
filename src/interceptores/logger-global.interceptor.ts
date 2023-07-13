import {
  CallHandler,
  ConsoleLogger,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { RequisicaoComUsuario } from 'src/autenticacao/guards/autenticacao.guard';

@Injectable()
export class LoggerGlobalInterceptor implements NestInterceptor {
  constructor(private logger: ConsoleLogger) {}

  intercept(contexto: ExecutionContext, next: CallHandler): Observable<any> {
    const contextoHttp = contexto.switchToHttp();

    const requisicao = contextoHttp.getRequest<
      Request | RequisicaoComUsuario
    >();
    const resposta = contextoHttp.getResponse<Response>();

    const { path, method } = requisicao;
    const { statusCode } = resposta;

    this.logger.log(`${method} ${path}`);

    const instantePreControlador = Date.now();

    return next.handle().pipe(
      tap(() => {
        if ('usuario' in requisicao) {
          this.logger.log(
            `Rota acessada pelo usuário: ${requisicao.usuario.sub}`,
          );
        }

        const tempoPassado = Date.now() - instantePreControlador;

        this.logger.log(`Resposta: status ${statusCode} - ${tempoPassado}ms`);
      }),
    );
  }
}
