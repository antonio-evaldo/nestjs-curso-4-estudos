import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  CacheInterceptor,
  UseInterceptors,
  Inject,
} from '@nestjs/common';

import { CACHE_MANAGER, CacheTTL, CacheKey } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { AtualizaProdutoDTO } from './dto/AtualizaProduto.dto';
import { CriaProdutoDTO } from './dto/CriaProduto.dto';
import { ProdutoService } from './produto.service';

@Controller('produtos')
export class ProdutoController {
  constructor(
    private readonly produtoService: ProdutoService,
    @Inject(CACHE_MANAGER) private gerenciadorDeCache: Cache,
  ) {}

  @Post()
  async criaNovo(@Body() dadosProduto: CriaProdutoDTO) {
    const produtoCadastrado = await this.produtoService.criaProduto(
      dadosProduto,
    );

    return {
      mensagem: 'Produto criado com sucesso.',
      produto: produtoCadastrado,
    };
  }

  @Get()
  async listaTodos() {
    return this.produtoService.listProdutos();
  }

  @Get('/:id')
  @UseInterceptors(CacheInterceptor)
  // @CacheKey('teste123')
  // @CacheTTL(10)
  async listaUm(@Param('id') id: string) {
    const produtoSalvo = await this.produtoService.listUmProduto(id);

    return produtoSalvo;
  }

  @Put('/:id')
  async atualiza(
    @Param('id') id: string,
    @Body() dadosProduto: AtualizaProdutoDTO,
  ) {
    const produtoAlterado = await this.produtoService.atualizaProduto(
      id,
      dadosProduto,
    );

    return {
      mensagem: 'produto atualizado com sucesso',
      produto: produtoAlterado,
    };
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const produtoRemovido = await this.produtoService.deletaProduto(id);

    return {
      mensagem: 'produto removido com sucesso',
      produto: produtoRemovido,
    };
  }
}
