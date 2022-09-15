/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';

import { faker } from '@faker-js/faker';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadosList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermercadosList = [];
    for(let i = 0; i < 5; i++){
        const supermercado: SupermercadoEntity = await repository.save({
          nombre: "Almacenes Éxito S.A.",
          latitud: faker.datatype.number(),
          longitud: faker.datatype.number(),
          sitioweb: faker.internet.url(),
          sedes: []
        })
        supermercadosList.push(supermercado);
    }
  }
    
  it('Debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll debería retornar todos los supermercados', async () => {
    const supermercadoes: SupermercadoEntity[] = await service.findAll();
    expect(supermercadoes).not.toBeNull();
    expect(supermercadoes).toHaveLength(supermercadosList.length);
  });

  it('findOne debería retornar un supermercado por ID', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadosList[0];
    const supermercado: SupermercadoEntity = await service.findOne(storedSupermercado.id);
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre)
    expect(supermercado.latitud).toEqual(storedSupermercado.latitud)
    expect(supermercado.longitud).toEqual(storedSupermercado.longitud)
    expect(supermercado.sitioweb).toEqual(storedSupermercado.sitioweb)
  });

  it('findOne Debería arrojar una excepción por supermercado inválido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El supermercado con el ID dado no fue encontrado")
  });

  it('create debería retornar un nuevo supermercado', async () => {
    const supermercado: SupermercadoEntity = {
      id: "",
      nombre: "Falabella S.A.",
      latitud: faker.datatype.number(),
      longitud: faker.datatype.number(),
      sitioweb: faker.internet.url(),
      sedes: []
    }

    const newSupermercado: SupermercadoEntity = await service.create(supermercado);
    expect(newSupermercado).not.toBeNull();

    const storedSupermercado: SupermercadoEntity = await repository.findOne({where: {id: newSupermercado.id}})
    expect(storedSupermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre)
    expect(supermercado.latitud).toEqual(storedSupermercado.latitud)
    expect(supermercado.longitud).toEqual(storedSupermercado.longitud)
    expect(supermercado.sitioweb).toEqual(storedSupermercado.sitioweb)
  });

  it('create debería arrojar una excepción por longitud de nombre de supermercado', async () => {
    const supermercado: SupermercadoEntity = {
      id: "",
      nombre: "TIA",
      latitud: faker.datatype.number(),
      longitud: faker.datatype.number(),
      sitioweb: faker.internet.url(),
      sedes: []
    }

    await expect(() => service.create(supermercado)).rejects.toHaveProperty("message", "El nombre del supermercado debe tener más de " + service.minLongNombreSupermercado + " letras")
  });

  it('update debería modificar un supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado.nombre = "Nuevo nombre de supermercado";
    supermercado.latitud = 777777;
    supermercado.longitud = 888888;
    supermercado.sitioweb = "fakeurl";
  
    const updatedSupermercado: SupermercadoEntity = await service.update(supermercado.id, supermercado);
    expect(updatedSupermercado).not.toBeNull();
  
    const storedSupermercado: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre)
    expect(storedSupermercado.latitud).toEqual(supermercado.latitud)
    expect(storedSupermercado.longitud).toEqual(supermercado.longitud)
    expect(storedSupermercado.sitioweb).toEqual(supermercado.sitioweb)
  });
 
  it('update debería arrojar una excepción por longitud de nombre de supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado.nombre = "Lay";
    supermercado.latitud = 777777;
    supermercado.longitud = 888888;
    supermercado.sitioweb = "fakeurl";
    
    await expect(() => service.update(supermercado.id, supermercado)).rejects.toHaveProperty("message", "El nombre del supermercado debe tener más de " + service.minLongNombreSupermercado + " letras")
  });

  it('update debería arrojar una excepción por supermercado inválido', async () => {
    let supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado = {
      ...supermercado, nombre: "Nuevo nombre", latitud: 666666, longitud: 555555, sitioweb: "fakeurl"
    }
    await expect(() => service.update("0", supermercado)).rejects.toHaveProperty("message", "El supermercado con el ID dado no fue encontrado")
  });

  it('delete debería eliminar una supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermercado.id);
  
    const deletedSupermercado: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
    expect(deletedSupermercado).toBeNull();
  });

  it('delete debería arrojar una excepción por supermercado inválida', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermercado.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El supermercado con el ID dado no fue encontrado")
  });
 
});
