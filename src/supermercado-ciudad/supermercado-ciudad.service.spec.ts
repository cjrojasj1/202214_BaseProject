/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SupermercadoCiudadService', () => {
  let service: SupermercadoCiudadService;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudadRepository: Repository<CiudadEntity>;
  let ciudad: CiudadEntity;
  let supermercadosList : SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoCiudadService],
    }).compile();

    service = module.get<SupermercadoCiudadService>(SupermercadoCiudadService);
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    ciudadRepository.clear();
    supermercadoRepository.clear();

    supermercadosList = [];
    for(let i = 0; i < 5; i++){
        const supermercado: SupermercadoEntity = await supermercadoRepository.save({
          nombre: "Almacenes Éxito S.A.",
          latitud: faker.datatype.number(),
          longitud: faker.datatype.number(),
          sitioweb: faker.internet.url()
        })
        supermercadosList.push(supermercado);
    }

    ciudad = await ciudadRepository.save({
      nombre: faker.company.name(),
      pais: 'Argentina',
      habitantes: faker.datatype.number(),
      supermercados: supermercadosList
    })
  }

  it('Debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity debería asociar un supermercado a una ciudad', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
          nombre: faker.company.name(),
          pais: 'Paraguay',
          habitantes: faker.datatype.number()
    });

    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
          nombre: "Almacenes Jumbo S.A.",
          latitud: faker.datatype.number(),
          longitud: faker.datatype.number(),
          sitioweb: faker.internet.url()
    })

    const result: CiudadEntity = await service.addSupermarketToCity(newCiudad.id, newSupermercado.id);
    
    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(newSupermercado.nombre)
    expect(result.supermercados[0].latitud).toBe(newSupermercado.latitud)
    expect(result.supermercados[0].longitud).toBe(newSupermercado.longitud)
    expect(result.supermercados[0].sitioweb).toBe(newSupermercado.sitioweb)
  });

  it('addSupermarketToCity debería arrojar una excepción por supermercado inválido', async () => {
    await expect(() => service.addSupermarketToCity(ciudad.id, "0")).rejects.toHaveProperty("message", "El supermercado con el ID dado no fue encontrado");
  });

  it('addSupermarketToCity debería arrojar una excepción por ciudad inválida', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(() => service.addSupermarketToCity("0", supermercado.id)).rejects.toHaveProperty("message", "La ciudad con el ID dado no fue encontrada");
  });

  it('findSupermarketsFromCity debería retornar los supermercados de una ciudad', async ()=>{
    const supermercados: SupermercadoEntity[] = await service.findSupermarketsFromCity(ciudad.id);
    expect(supermercados.length).toBe(5)
  });

  it('findSupermarketsFromCity debería arrojar una exceción por ciudad inválida', async () => {
    await expect(()=> service.findSupermarketsFromCity("0")).rejects.toHaveProperty("message", "La ciudad con el ID dado no fue encontrada"); 
  });


  it('findSupermarketFromCity should return ciudad by supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    const storedSupermercado: SupermercadoEntity = await service.findSupermarketFromCity(ciudad.id, supermercado.id, )
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toBe(supermercado.nombre);
    expect(storedSupermercado.latitud).toBe(supermercado.latitud);
    expect(storedSupermercado.longitud).toBe(supermercado.longitud);
    expect(storedSupermercado.sitioweb).toBe(supermercado.sitioweb);
  });

  it('findSupermarketFromCity debería retornar una excepción por supermercado inválido', async () => {
    await expect(()=> service.findSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "El supermercado con el ID dado no fue encontrado"); 
  });

  it('findSupermarketFromCity should throw an exception for an invalid supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(()=> service.findSupermarketFromCity("0", supermercado.id)).rejects.toHaveProperty("message", "La ciudad con el ID dado no fue encontrada"); 
  });

  it('findSupermarketFromCity debería arrojar una excepción por un supermercado no asociado a una ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: "Almacenes Éxito S.A.",
      latitud: faker.datatype.number(),
      longitud: faker.datatype.number(),
      sitioweb: faker.internet.url(),
  })
    await expect(()=> service.findSupermarketFromCity(ciudad.id, newSupermercado.id)).rejects.toHaveProperty("message", "El supermercado con el ID dado no se encuentra asociado a la ciudad"); 
  });


  it('updateSupermarketsFromCity debería actualizar supermercados de una ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: "Almacenes Éxito S.A.",
      latitud: faker.datatype.number(),
      longitud: faker.datatype.number(),
      sitioweb: faker.internet.url(),
  })

    const updatedCiudad: CiudadEntity = await service.updateSupermarketsFromCity(ciudad.id, [newSupermercado]);
    expect(updatedCiudad.supermercados.length).toBe(1);
    expect(updatedCiudad.supermercados[0].nombre).toBe(newSupermercado.nombre);
    expect(updatedCiudad.supermercados[0].latitud).toBe(newSupermercado.latitud);
    expect(updatedCiudad.supermercados[0].longitud).toBe(newSupermercado.longitud);
    expect(updatedCiudad.supermercados[0].sitioweb).toBe(newSupermercado.sitioweb);
  });

  it('updateSupermarketsFromCity debería arrojar una excepción por una ciudad inválida', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: "Almacenes Éxito S.A.",
      latitud: faker.datatype.number(),
      longitud: faker.datatype.number(),
      sitioweb: faker.internet.url(),
  })

    await expect(()=> service.updateSupermarketsFromCity("0", [newSupermercado])).rejects.toHaveProperty("message", "La ciudad con el ID dado no fue encontrada"); 
  });

  it('updateSupermarketsFromCity debería arrojar una excepción por un supermercado inválido', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: "Almacenes Éxito S.A.",
      latitud: faker.datatype.number(),
      longitud: faker.datatype.number(),
      sitioweb: faker.internet.url(),
  })
  newSupermercado.id = "0";

    await expect(()=> service.updateSupermarketsFromCity(ciudad.id, [newSupermercado])).rejects.toHaveProperty("message", "El supermercado con el ID dado no fue encontrado"); 
  });

  it('deleteSupermarketFromCity debería remover un supermercado de una ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    
    await service.deleteSupermarketFromCity(ciudad.id, supermercado.id);

    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({where: {id: ciudad.id}, relations: ["supermercados"]});
    const deletedSupermercado: SupermercadoEntity = storedCiudad.supermercados.find(a => a.id === supermercado.id);

    expect(deletedSupermercado).toBeUndefined();

  });

  it('deleteSupermarketFromCity debería arrojar una excepción por supermercado inválido', async () => {
    await expect(()=> service.deleteSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "El supermercado con el ID dado no fue encontrado"); 
  });

  it('deleteSupermarketFromCity debería arrojar una excepción por ciudad inválida', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(()=> service.deleteSupermarketFromCity("0", supermercado.id)).rejects.toHaveProperty("message", "La ciudad con el ID dado no fue encontrada"); 
  });

  it('deleteSupermarketFromCity should thrown an exception for an non asocciated ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: "Almacenes Éxito S.A.",
      latitud: faker.datatype.number(),
      longitud: faker.datatype.number(),
      sitioweb: faker.internet.url(),
  })

    await expect(()=> service.deleteSupermarketFromCity(ciudad.id, newSupermercado.id)).rejects.toHaveProperty("message", "El supermercado con el ID dado no se encuentra asociado a la ciudad"); 
  }); 

});
