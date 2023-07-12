import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { HashearSenhaPipe } from 'src/autenticacao/pipes/hashear-senha.pipe';
import { MensagemRetorno } from '../decoradores/definir-metadados.decorator';
import { EntidadeParaDTOInterceptor } from '../interceptores/transforma-entidade-para-dto.interceptor';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';
import { CriaUsuarioDTO } from './dto/CriaUsuario.dto';
import { ListaUsuarioDTO } from './dto/ListaUsuario.dto';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';

@Controller('/usuarios')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @Post()
  @UseInterceptors(new EntidadeParaDTOInterceptor(ListaUsuarioDTO))
  @MensagemRetorno('Usuário criado com sucesso.')
  async criaUsuario(
    @Body() { senha, ...dadosDoUsuario }: CriaUsuarioDTO,
    @Body('senha', HashearSenhaPipe) senhaHasheada: string,
  ): Promise<UsuarioEntity> {
    return this.usuarioService.criaUsuario({
      ...dadosDoUsuario,
      senha: senhaHasheada,
    });
  }

  @Get()
  @UseInterceptors(new EntidadeParaDTOInterceptor(ListaUsuarioDTO))
  async listUsuarios(): Promise<UsuarioEntity[]> {
    return this.usuarioService.listUsuarios();
  }

  @Put('/:id')
  @UseInterceptors(new EntidadeParaDTOInterceptor(ListaUsuarioDTO))
  @MensagemRetorno('Usuário atualizado com sucesso.')
  async atualizaUsuario(
    @Param('id') id: string,
    @Body() novosDados: AtualizaUsuarioDTO,
  ): Promise<UsuarioEntity> {
    return this.usuarioService.atualizaUsuario(id, novosDados);
  }

  @Delete('/:id')
  @MensagemRetorno('Usuário removido com sucesso.')
  async removeUsuario(@Param('id') id: string) {
    return this.usuarioService.deletaUsuario(id);
  }
}
