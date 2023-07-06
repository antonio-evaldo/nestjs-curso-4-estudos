import { PipeTransform, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UsuarioEntity } from 'src/usuario/usuario.entity';

@Injectable()
export class SenhaHasheadaPipe implements PipeTransform {
  constructor(
    @InjectRepository(UsuarioEntity)
     private configService: ConfigService) {}

  async transform(senha: string): Promise<string> {
    const sal = this.configService.get<string>('SAL_SENHA');
    const senhaHasheada = await bcrypt.hash(senha, sal!);
    return senhaHasheada;
  }
}

//pipe de transformação