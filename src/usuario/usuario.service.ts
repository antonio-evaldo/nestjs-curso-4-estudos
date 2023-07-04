import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { Repository } from 'typeorm';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';
import { CriaUsuarioDTO } from './dto/CriaUsuario.dto';

import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    private configService: ConfigService
  ) {}

  async criaUsuario({ senha, ...dadosDoUsuario }: CriaUsuarioDTO) {
    const usuarioEntity = new UsuarioEntity();

    // transformar a senha em senhaHasheada

    // const sal = 10;
    const sal = this.configService.get<string>('SAL_SENHA');

    const senhaHasheada = await bcrypt.hash(senha, sal!);

    Object.assign(usuarioEntity, dadosDoUsuario as UsuarioEntity, { senha: senhaHasheada });//propriedade senha recebe a senhaHasehada

    return this.usuarioRepository.save(usuarioEntity);
  }

  async listUsuarios() {
    const usuariosSalvos = await this.usuarioRepository.find();
    return usuariosSalvos;
  }

  async buscaPorEmail(email: string) {
    const checkEmail = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (checkEmail === null)
      throw new NotFoundException('O email não foi encontrado.');

    return checkEmail;
  }
  async atualizaUsuario(id: string, novosDados: AtualizaUsuarioDTO) {
    const usuario = await this.usuarioRepository.findOneBy({ id });

    if (usuario === null)
      throw new NotFoundException('O usuário não foi encontrado.');

    Object.assign(usuario, novosDados as UsuarioEntity);

    return this.usuarioRepository.save(usuario);
  }

  async deletaUsuario(id: string) {
    const resultado = await this.usuarioRepository.delete(id);

    if (!resultado.affected)
      throw new NotFoundException('O usuário não foi encontrado.');
  }
}
