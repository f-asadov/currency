import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RedisOptions } from './config/app-options.constants';
import { dbConfig } from './config/typeorm';
import { CurrencyModule } from './currency/currency.module';




@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), CurrencyModule, ConfigModule.forRoot({
    isGlobal: true,
  })
    , CacheModule.registerAsync(RedisOptions), AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
