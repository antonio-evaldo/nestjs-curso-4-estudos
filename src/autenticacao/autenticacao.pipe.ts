import { PipeTransform, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CriaUsuarioDTO } from 'src/usuario/dto/CriaUsuario.dto';

@Injectable()
export class SenhaHasheadaPipe implements PipeTransform {
  constructor(private configService: ConfigService) {}

  async transform({
    senha,
    ...dadosDoUsuarioRestantes
  }: CriaUsuarioDTO): Promise<CriaUsuarioDTO> {
    const sal = this.configService.get<string>('SAL_SENHA');

    const senhaHasheada = await bcrypt.hash(senha, sal!);

    return { senha: senhaHasheada, ...dadosDoUsuarioRestantes };
  }
}

//pipe de transformação
