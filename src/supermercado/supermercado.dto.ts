import { IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

export class SupermercadoDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsNumber()
    @IsNotEmpty()
    latitud: number;

    @IsNumber()
    @IsNotEmpty()
    longitud: number;

    @IsUrl()
    @IsNotEmpty()
    sitioweb: string;

}
