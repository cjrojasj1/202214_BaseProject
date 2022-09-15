import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
@Injectable()
export class SupermercadoCiudadService {

    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,

        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>
    ) { }

    async addSupermarketToCity(idCiudad: string, idSupermercado: string): Promise<CiudadEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({ where: { id: idSupermercado } });
        if (!supermercado)
            throw new BusinessLogicException("El supermercado con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({ where: { id: idCiudad }, relations: ["supermercados"] })
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND);

        ciudad.supermercados = [...ciudad.supermercados, supermercado];
        return await this.ciudadRepository.save(ciudad);
    }

    async findSupermarketsFromCity(idCiudad: string): Promise<SupermercadoEntity[]> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({ where: { id: idCiudad }, relations: ["supermercados"] });
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND)

        return ciudad.supermercados;
    }

    async findSupermarketFromCity(idCiudad: string, idSupermercado: string): Promise<SupermercadoEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({ where: { id: idSupermercado } });
        if (!supermercado)
            throw new BusinessLogicException("El supermercado con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({ where: { id: idCiudad }, relations: ["supermercados"] });
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND)

        const ciudadSupermercado: SupermercadoEntity = ciudad.supermercados.find(e => e.id === supermercado.id);

        if (!ciudadSupermercado)
            throw new BusinessLogicException("El supermercado con el ID dado no se encuentra asociado a la ciudad", BusinessError.PRECONDITION_FAILED)

        return ciudadSupermercado;
    }

    async updateSupermarketsFromCity(idCiudad: string, supermercados: SupermercadoEntity[]): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: idCiudad}, relations: ["supermercados"]});
    
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < supermercados.length; i++) {
          const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercados[i].id}});
          if (!supermercado)
            throw new BusinessLogicException("El supermercado con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
        }
    
        ciudad.supermercados = supermercados;
        return await this.ciudadRepository.save(ciudad);
      }
    
    async deleteSupermarketFromCity(idCiudad: string, idSupermercado: string){
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: idSupermercado}});
        if (!supermercado)
          throw new BusinessLogicException("El supermercado con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: idCiudad}, relations: ["supermercados"]});
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
    
        const ciudadSupermercado: SupermercadoEntity = ciudad.supermercados.find(e => e.id === supermercado.id);
    
        if (!ciudadSupermercado)
            throw new BusinessLogicException("El supermercado con el ID dado no se encuentra asociado a la ciudad", BusinessError.PRECONDITION_FAILED)
 
        ciudad.supermercados = ciudad.supermercados.filter(e => e.id !== idSupermercado);
        await this.ciudadRepository.save(ciudad);
    } 

}