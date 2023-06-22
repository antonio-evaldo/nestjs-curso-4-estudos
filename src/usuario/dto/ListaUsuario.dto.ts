import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ListaUsuarioDTO {
  @Expose()
  id: string;

  @Expose()
  nome: string;
}
