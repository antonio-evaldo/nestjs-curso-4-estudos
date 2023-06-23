import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class PersonalizaRetorno implements NestInterceptor {
  constructor(private readonly mensagem = 'Operação realizada com sucesso.') {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(map((dados) => ({ dados, mensagem: this.mensagem })));
  }
}
