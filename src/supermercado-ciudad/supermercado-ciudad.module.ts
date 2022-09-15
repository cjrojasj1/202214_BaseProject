import { Module } from '@nestjs/common';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';

@Module({
  providers: [SupermercadoCiudadService]
})
export class SupermercadoCiudadModule {}
