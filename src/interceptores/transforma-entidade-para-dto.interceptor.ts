import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class EntidadeParaDTOInterceptor implements NestInterceptor {
  constructor(private readonly classeDTO) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('código antes do método do controlador...');

    return next
      .handle() // execução do método do controlador
      .pipe(
        // operações após a execução do método
        map((entidade) => plainToInstance(this.classeDTO, entidade)),
      );
  }
}
