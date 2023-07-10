import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
// import * as redisStore from 'cache-manager-redis-store';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';

import { ProdutoModule } from './produto/produto.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PostgresConfigService } from './config/postgres.config.service';
import { PedidoModule } from './pedido/pedido.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { FiltroDeExcecaoGlobal } from './filtros/filtro-de-excecao-global';
import { PersonalizaRetornoInterceptor } from './interceptores/personaliza-retorno.interceptor';
import { AutenticacaoModule } from './autenticacao/autenticacao.module';

@Module({
  imports: [
    UsuarioModule,
    ProdutoModule,
    PedidoModule,
    AutenticacaoModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore(),
        isGlobal: true,
        ttl: 10000,
      }),
      // store: redisStore(),
      // host: 'localhost',
      // port: 6379,
      // isGlobal: true,
      // ttl: 10000,
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: FiltroDeExcecaoGlobal,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PersonalizaRetornoInterceptor,
    },
  ],
})
export class AppModule {}
