import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyService } from '../../src/currency/currency.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Currency } from '../../src/entities/currency.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import axios from 'axios';

jest.mock('axios');

describe('CurrencyService', () => {
  let service: CurrencyService;
  let currencyRepo: Repository<Currency>;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        {
          provide: getRepositoryToken(Currency),
          useClass: Repository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://mock-url.com'),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
    currencyRepo = module.get<Repository<Currency>>(getRepositoryToken(Currency));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should return currencies from Redis cache if available', async () => {
    const mockCachedCurrencies = [
      { currencyId: 'R01010', charCode: 'USD', name: 'US Dollar', nominal: 1, history: [{ date: '2023-01-01', value: 60.1234 }] },
    ];

    jest.spyOn(cacheManager, 'get').mockResolvedValue(mockCachedCurrencies);

    const result = await service.getCurrency();

    expect(cacheManager.get).toHaveBeenCalledWith('currencies');
    expect(result).toEqual(mockCachedCurrencies);
  });

  it('should return currencies from database and cache them if Redis is empty', async () => {
    const mockCurrenciesFromDB: {
      id: number;
      currencyId: string;
      charCode: string;
      name: string;
      nominal: number;
      history: {
        date: string;
        value: number;
      }[];
    }[] = [
      {
        id: 1,
        currencyId: 'R01010',
        charCode: 'USD',
        name: 'US Dollar',
        nominal: 1,
        history: [{ date: '2023-01-01', value: 60.1234 }],
      },
    ];

    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    jest.spyOn(currencyRepo, 'find').mockResolvedValue(mockCurrenciesFromDB);
    jest.spyOn(cacheManager, 'set').mockResolvedValue(null);

    const result = await service.getCurrency();

    expect(cacheManager.get).toHaveBeenCalledWith('currencies');
    expect(currencyRepo.find).toHaveBeenCalled();
    expect(cacheManager.set).toHaveBeenCalledWith('currencies', mockCurrenciesFromDB, 3600);
    expect(result).toEqual(mockCurrenciesFromDB);
  });

  it('should log error if fetching currency data fails', async () => {
    const loggerErrorSpy = jest.spyOn(service['logger'], 'error');
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

    await service.parseCurrency();

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch currency data: Network Error'
    );
  });
});
