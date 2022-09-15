/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity';

@Injectable()
export class SupermercadoService {

    public minLongNombreSupermercado = 10

    constructor(
        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>
    ){}

    async findAll(): Promise<SupermercadoEntity[]> {
        return await this.supermercadoRepository.find({ relations: ["sedes"] });
    }

    async findOne(id: string): Promise<SupermercadoEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id}, relations: ["sedes"] } );
        if (!supermercado)
          throw new BusinessLogicException("El supermercado con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
        return supermercado;
    }
    
    async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        if (supermercado.nombre.length <= this.minLongNombreSupermercado)
            throw new BusinessLogicException("El nombre del supermercado debe tener más de " + this.minLongNombreSupermercado + " letras", BusinessError.NOT_FOUND);
        return await this.supermercadoRepository.save(supermercado);
    }

    async update(id: string, supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        const persistedSupermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where:{id}});
        if (!persistedSupermercado)
          throw new BusinessLogicException("El supermercado con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
        if (supermercado.nombre.length <= this.minLongNombreSupermercado)
          throw new BusinessLogicException("El nombre del supermercado debe tener más de " + this.minLongNombreSupermercado + " letras", BusinessError.NOT_FOUND);
        return await this.supermercadoRepository.save({...persistedSupermercado, ...supermercado});
    }

    async delete(id: string) {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where:{id}});
        if (!supermercado)
          throw new BusinessLogicException("El supermercado con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
      
        await this.supermercadoRepository.remove(supermercado);
    }
}