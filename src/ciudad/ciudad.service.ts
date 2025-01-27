/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';

@Injectable()
export class CiudadService {
    private listaPaises = ['Argentina', 'Ecuador', 'Paraguay']

    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
    ){}

    async findAll(): Promise<CiudadEntity[]> {
        return await this.ciudadRepository.find({ relations: ["supermercados"] });
    }

    async findOne(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, relations: ["supermercados"] } );
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
    
        return ciudad;
    }
    
    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        let paisValido = this.listaPaises.find(s => s == ciudad.pais)
        if (!paisValido)
          throw new BusinessLogicException("El país con el nombre asociado no está permitido", BusinessError.PRECONDITION_FAILED);
        return await this.ciudadRepository.save(ciudad);
    }

    async update(idCiudad: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
        const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id: idCiudad}});
        if (!persistedCiudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
        let paisValido = this.listaPaises.find(s => s == ciudad.pais)
        if (!paisValido)
            throw new BusinessLogicException("El país con el nombre asociado no está permitido", BusinessError.PRECONDITION_FAILED);
          
        return await this.ciudadRepository.save({...persistedCiudad, ...ciudad});
    }

    async delete(id: string) {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
      
        await this.ciudadRepository.remove(ciudad);
    }
}