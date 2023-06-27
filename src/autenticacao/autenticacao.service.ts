import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
@Injectable()
export class AutenticacaoService {
  constructor(private readonly usuarioService: UsuarioService) {}

  async login(email: string, senha: string): Promise<any> {
    const usuario = await this.usuarioService.buscaPorEmail(email);
    if (usuario.senha !== senha) {
      throw new UnauthorizedException('A senha digitada está incorreta.');
    }

    // const payload = {
    //   sub: usuario.id,
    //   usuarioNome: usuario.nome,
    // };
    // return {
    //   access_token: await this.jwtService.signAsync(payload),
    // };
    return usuario;
  }
}
