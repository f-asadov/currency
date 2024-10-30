import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as iconv from 'iconv-lite';
import { Currency } from '../../src/entities/currency.entity';
import { Repository } from 'typeorm';
import { parseStringPromise } from 'xml2js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'; 


@Injectable()
export class CurrencyService implements OnModuleInit {
    private readonly logger = new Logger(CurrencyService.name);

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Currency)
        private readonly currencyRepo: Repository<Currency>,
        @Inject(CACHE_MANAGER) private readonly  cacheManager: Cache
        
    ) {}

    onModuleInit() {
        this.parseCurrency()
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async parseCurrency() {
        try {
            const url: string = this.configService.get('CURRENCY_URL');
            this.logger.log('Fetching actual currency data from CBR.');
            
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                responseEncoding: 'binary',
            });

            const xmlData = iconv.decode(Buffer.from(response.data), 'win1251');
            const parsedData = await parseStringPromise(xmlData);

            const date = parsedData.ValCurs.$.Date;
            const [day, month, year] = date.split('.');
            const currentDate = new Date(`${year}-${month}-${day}`);

            const currencyUpdates = parsedData.ValCurs.Valute.map(async valute => {
                const currencyId = valute.$.ID;
                const newValue = parseFloat(valute.Value[0].replace(',', '.'));

                
                let currency = await this.currencyRepo.findOne({ where: { currencyId } });

                if (currency) {
                    
                    const historyEntry = {
                        date: currentDate.toISOString().split('T')[0],
                        value: newValue,
                    };

                    const isDatePresent = currency.history.some(entry => entry.date === historyEntry.date);

                    if (!isDatePresent) {
                        currency.history.push(historyEntry);
                        await this.currencyRepo.save(currency);
                    }
                } else {
                    const newCurrency = this.currencyRepo.create({
                        currencyId: currencyId,
                        charCode: valute.CharCode[0],
                        name: valute.Name[0],
                        nominal: parseInt(valute.Nominal[0], 10),
                        history: [{ date: currentDate.toISOString().split('T')[0], value: newValue }],
                    });

                    await this.currencyRepo.save(newCurrency); 
                }
            });
            await Promise.all(currencyUpdates);
            this.redisInit()
            this.logger.log('Currency data successfully updated.');
        } catch (error) {
            this.logger.error(`Failed to fetch currency data: ${error.message}`);
        }
    }

    async getCurrency() {
        const cachedCurrencies = await this.cacheManager.get('currencies');
        
        if (cachedCurrencies) {
          this.logger.log('Returning currencies from Redis cache.');
          return cachedCurrencies
        }
    
        
        const currencies = await this.currencyRepo.find();
        
        
        currencies.forEach(currency => {
          currency.history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        });
    
        await this.cacheManager.set('currencies', currencies,3600); 
    
        this.logger.log('Returning currencies from database and caching them in Redis.');
        return currencies;
      }


    async redisInit(){
        const currencies = await this.currencyRepo.find();
        await this.cacheManager.set('currencies', currencies,0)
    }
}
