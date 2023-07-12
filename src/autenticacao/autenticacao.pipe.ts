import { PipeTransform, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SenhaHasheadaPipe implements PipeTransform {
  constructor(private configService: ConfigService) {}

  async transform(senha: string): Promise<string> {
    const sal = this.configService.get<string>('SAL_SENHA');

    const senhaHasheada = await bcrypt.hash(senha, sal!);

    return senhaHasheada;
  }
}

//pipe de transformação
