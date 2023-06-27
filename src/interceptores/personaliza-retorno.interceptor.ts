import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { CHAVE_MENSAGEM_RETORNO } from '../decoradores/definir-metadados.decorator';

@Injectable()
export class PersonalizaRetornoInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(
    contexto: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const mensagem = this.reflector.get<string | undefined>(
      CHAVE_MENSAGEM_RETORNO,
      contexto.getHandler(),
    );

    return next.handle().pipe(
      map((dados) => ({
        dados,
        mensagem: mensagem ?? 'Operação realizada com sucesso.',
      })),
    );
  }
}
