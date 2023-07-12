import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { AtualizaPedidoDto } from './dto/AtualizaPedido.dto';
import { CriaPedidoDTO } from './dto/CriaPedido.dto';
import {
  AutenticacaoGuard,
  RequisicaoComUsuario,
} from '../autenticacao/autenticacao.guard';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  @UseGuards(AutenticacaoGuard)
  async criaPedido(
    @Req() req: RequisicaoComUsuario,
    @Body() dadosDoPedido: CriaPedidoDTO,
  ) {
    const usuarioId = req.usuario.sub;

    const pedidoCriado = await this.pedidoService.cadastraPedido(
      usuarioId,
      dadosDoPedido,
    );
    return pedidoCriado;
  }

  @Get()
  @UseGuards(AutenticacaoGuard)
  async obtemPedidosDeUsuario(@Req() req: RequisicaoComUsuario) {
    const usuarioId = req.usuario.sub;

    const pedidos = await this.pedidoService.obtemPedidosDeUsuario(usuarioId);

    return pedidos;
  }

  @Patch(':id')
  @UseGuards(AutenticacaoGuard)
  atualizaPedido(
    @Param('id') pedidoId: string,
    @Body() dadosDeAtualizacao: AtualizaPedidoDto,
  ) {
    return this.pedidoService.atualizaPedido(pedidoId, dadosDeAtualizacao);
  }
}
