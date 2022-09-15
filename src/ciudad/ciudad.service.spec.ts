/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';

import { faker } from '@faker-js/faker';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadesList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadesList = [];
    for(let i = 0; i < 5; i++){
        const ciudad: CiudadEntity = await repository.save({
          nombre: faker.company.name(),
          pais: 'Argentina',
          habitantes: faker.datatype.number(),
          supermercados: []
        })
        ciudadesList.push(ciudad);
    }
  }
    
  it('Debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll debería retornar toda las ciudades', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadesList.length);
  });

  it('findOne debería retornar una ciudad por ID', async () => {
    const storedCiudad: CiudadEntity = ciudadesList[0];
    const ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre)
    expect(ciudad.pais).toEqual(storedCiudad.pais)
    expect(ciudad.habitantes).toEqual(storedCiudad.habitantes)
  });

  it('findOne Debería arrojar una excepción por ciudad inválida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La ciudad con el ID dado no fue encontrada")
  });

  it('create debería retornar una nueva ciudad', async () => {
    const ciudad: CiudadEntity = {
      id: "",
      nombre: faker.company.name(),
      pais: 'Paraguay',
      habitantes: faker.datatype.number(),
      supermercados: []
    }

    const newCiudad: CiudadEntity = await service.create(ciudad);
    expect(newCiudad).not.toBeNull();

    const storedCiudad: CiudadEntity = await repository.findOne({where: {id: newCiudad.id}})
    expect(storedCiudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre)
    expect(ciudad.pais).toEqual(storedCiudad.pais)
    expect(ciudad.habitantes).toEqual(storedCiudad.habitantes)
  });

  it('create debería arrojar una excepción por país inválido', async () => {
    const ciudad: CiudadEntity = {
      id: "",
      nombre: faker.company.name(),
      pais: 'Colombia',
      habitantes: faker.datatype.number(),
      supermercados: []
    }

    await expect(() => service.create(ciudad)).rejects.toHaveProperty("message", "El país con el nombre asociado no está permitido")
  });

  it('update debería modificar una ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    ciudad.nombre = "Nuevo nombre";
    ciudad.pais = "Ecuador";
    ciudad.habitantes = 999999
  
    const updatedCiudad: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(updatedCiudad).not.toBeNull();
  
    const storedCiudad: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(ciudad.nombre)
    expect(storedCiudad.pais).toEqual(ciudad.pais)
    expect(storedCiudad.habitantes).toEqual(ciudad.habitantes)
  });
 
  it('update debería arrojar una excepción por país inválido', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    ciudad.nombre = "Nuevo nombre";
    ciudad.pais = "Brasil";
    ciudad.habitantes = 999999
    await expect(() => service.update(ciudad.id, ciudad)).rejects.toHaveProperty("message", "El país con el nombre asociado no está permitido")
  });

  it('update debería arrojar una excepción por ciudad inválida', async () => {
    let ciudad: CiudadEntity = ciudadesList[0];
    ciudad = {
      ...ciudad, nombre: "Nuevo nombre", pais: "Argentina", habitantes: 99999
    }
    await expect(() => service.update("0", ciudad)).rejects.toHaveProperty("message", "La ciudad con el ID dado no fue encontrada")
  });

  it('delete debería eliminar una ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await service.delete(ciudad.id);
  
    const deletedCiudad: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(deletedCiudad).toBeNull();
  });

  it('delete debería arrojar una excepción por ciudad inválida', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await service.delete(ciudad.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La ciudad con el ID dado no fue encontrada")
  });
 
});
