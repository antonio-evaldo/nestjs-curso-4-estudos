import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class PersonalizaRetorno implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(
    contexto: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const mensagem = this.reflector.get<string | undefined>(
      'mensagem_retorno',
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
