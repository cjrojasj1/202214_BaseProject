import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SupermercadoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    latitud: number;

    @Column()
    longitud: number;

    @Column()
    sitioweb: string;

}
