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
import { MensagemRetorno } from '../decoradores/mensagem-retorno.decorator';
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
  @UseInterceptors(new TransformaEntidadeParaDTO(ListaUsuarioDTO))
  @MensagemRetorno('Usuário criado com sucesso.')
  async criaUsuario(
    @Body() dadosDoUsuario: CriaUsuarioDTO,
  ): Promise<UsuarioEntity> {
    return this.usuarioService.criaUsuario(dadosDoUsuario);
  }

  @Get()
  @UseInterceptors(new TransformaEntidadeParaDTO(ListaUsuarioDTO))
  async listUsuarios(): Promise<UsuarioEntity[]> {
    return this.usuarioService.listUsuarios();
  }

  @Put('/:id')
  @UseInterceptors(new TransformaEntidadeParaDTO(ListaUsuarioDTO))
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
