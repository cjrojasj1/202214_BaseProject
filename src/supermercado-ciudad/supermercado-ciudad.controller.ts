/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SupermercadoDto } from 'src/supermercado/supermercado.dto';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoCiudadController {
    constructor(private readonly supermercadoCiudadService: SupermercadoCiudadService){}

    @Post(':ciudadId/supermarkets/:supermercadoId')
    async addSupermarketToCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
        return await this.supermercadoCiudadService.addSupermarketToCity(ciudadId, supermercadoId);
    }

    @Get(':ciudadId/supermarkets/:supermercadoId')
    async findSupermarketFromCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
        return await this.supermercadoCiudadService.findSupermarketFromCity(ciudadId, supermercadoId);
    }

    @Get(':ciudadId/supermarkets')
    async findSupermarketsFromCity(@Param('ciudadId') ciudadId: string){
        return await this.supermercadoCiudadService.findSupermarketsFromCity(ciudadId);
    }

    @Put(':ciudadId/supermarkets')
    async updateSupermarketsFromCity(@Body() supermercadosDto: SupermercadoDto[], @Param('ciudadId') ciudadId: string){
        const supermercados = plainToInstance(SupermercadoEntity, supermercadosDto)
        return await this.supermercadoCiudadService.updateSupermarketsFromCity(ciudadId, supermercados);
    }
    
    @Delete(':ciudadId/supermarkets/:supermercadoId')
    @HttpCode(204)
    async deleteSupermarketFromCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
        return await this.supermercadoCiudadService.deleteSupermarketFromCity(ciudadId, supermercadoId);
    }
}
