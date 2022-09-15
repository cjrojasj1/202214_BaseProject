import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CiudadModule } from './ciudad/ciudad.module';
import { SupermercadoModule } from './supermercado/supermercado.module';
import { SupermercadoCiudadModule } from './supermercado-ciudad/supermercado-ciudad.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad/ciudad.entity';
import { SupermercadoEntity } from './supermercado/supermercado.entity';

@Module({
  imports: [CiudadModule, SupermercadoModule, SupermercadoCiudadModule,
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [CiudadEntity, SupermercadoEntity],
    synchronize: true,
    keepConnectionAlive: true
  }),
],  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
