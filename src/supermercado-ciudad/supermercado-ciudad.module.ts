import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';

@Module({
  providers: [SupermercadoCiudadService],
  imports: [TypeOrmModule.forFeature([SupermercadoEntity, CiudadEntity])],
})
export class SupermercadoCiudadModule {}