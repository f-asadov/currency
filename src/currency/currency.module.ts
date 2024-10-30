import { Module } from '@nestjs/common';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from 'src/entities/currency.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Currency]),ConfigModule],
  controllers: [CurrencyController],
  providers: [CurrencyService]
})
export class CurrencyModule {}
