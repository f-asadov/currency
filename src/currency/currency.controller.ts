import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Currency } from 'src/entities/currency.entity';
import { exampleValueCurrency } from 'src/config/constants';

@ApiTags('currency')
@ApiBearerAuth()
@Controller('currency')
export class CurrencyController {

    constructor(private readonly currencyService: CurrencyService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOkResponse({
        description: 'Return currency list',
        type: [Currency],
        examples: {
            exampleValue: {
                summary: 'Response example',
                value: exampleValueCurrency
            }
        }
    })
    async getActualCurrency() {
        return await this.currencyService.getCurrency();
    }

}
