import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsuarioPayload } from '../autenticacao.service';

export interface RequisicaoComUsuario extends Request {
  usuario: UsuarioPayload;
}

@Injectable()
export class AutenticacaoGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const requisicao = contexto
      .switchToHttp()
      .getRequest<RequisicaoComUsuario>();

    const token = this.extrairTokenDoCabecalho(requisicao);

    if (!token) {
      throw new UnauthorizedException('Erro de autenticação.');
    }

    try {
      const payload: UsuarioPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('SEGREDO_JWT'),
      });

      requisicao.usuario = payload;
    } catch (erro) {
      console.log(erro);

      throw new UnauthorizedException('Token JWT inválido.');
    }

    // Se não tiver sido lançado nenhuma execeção até aqui, autorizamos a rota
    return true;
  }

  private extrairTokenDoCabecalho(request: Request): string | undefined {
    // O token JWT é um Bearer Token

    /*
      headers: {
        authorization: "Bearer <valor_do_jwt>"
      }
    */

    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type == 'Bearer' ? token : undefined;
  }
}
