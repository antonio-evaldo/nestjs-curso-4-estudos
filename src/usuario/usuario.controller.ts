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
import { PersonalizaRetorno } from '../interceptores/personaliza-retorno.interceptor';
import { TransformaEntidadeParaDTO } from '../interceptores/transforma-entidade-para-dto.interceptor';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';
import { CriaUsuarioDTO } from './dto/CriaUsuario.dto';
import { ListaUsuarioDTO } from './dto/ListaUsuario.dto';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';

@Controller('/usuarios')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @Post()
  @UseInterceptors(
    new PersonalizaRetorno('Usuário criado com sucesso.'),
    new TransformaEntidadeParaDTO(ListaUsuarioDTO),
  )
  async criaUsuario(
    @Body() dadosDoUsuario: CriaUsuarioDTO,
  ): Promise<UsuarioEntity> {
    return this.usuarioService.criaUsuario(dadosDoUsuario);
  }

  @Get()
  @UseInterceptors(
    new PersonalizaRetorno(),
    new TransformaEntidadeParaDTO(ListaUsuarioDTO),
  )
  async listUsuarios(): Promise<UsuarioEntity[]> {
    return this.usuarioService.listUsuarios();
  }

  @Put('/:id')
  @UseInterceptors(
    new PersonalizaRetorno('Usuário atualizado com sucesso.'),
    new TransformaEntidadeParaDTO(ListaUsuarioDTO),
  )
  async atualizaUsuario(
    @Param('id') id: string,
    @Body() novosDados: AtualizaUsuarioDTO,
  ): Promise<UsuarioEntity> {
    return this.usuarioService.atualizaUsuario(id, novosDados);
  }

  @Delete('/:id')
  @UseInterceptors(new PersonalizaRetorno('Usuário deletado com sucesso.'))
  async removeUsuario(@Param('id') id: string) {
    return this.usuarioService.deletaUsuario(id);
  }
}
