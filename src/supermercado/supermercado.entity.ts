import { CiudadEntity } from 'src/ciudad/ciudad.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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

    @ManyToMany(() => CiudadEntity, ciudad => ciudad.supermercados)
    sedes: CiudadEntity[];    


}
