import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export interface UsuarioPayload {
  sub: string; // subject
  usuarioNome: string;
}

@Injectable()
export class AutenticacaoService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, senhaDigitada: string): Promise<any> {
    const usuario = await this.usuarioService.buscaPorEmail(email);

    const usuarioAutenticado = await bcrypt.compare(
      senhaDigitada,
      usuario.senha,
    );

    if (!usuarioAutenticado) {
      throw new UnauthorizedException('A senha digitada está incorreta.');
    }

    const payload: UsuarioPayload = {
      sub: usuario.id,
      usuarioNome: usuario.nome,
    };

    return {
      token_acesso: await this.jwtService.signAsync(payload),
    };
    // return usuario;
  }
}
