
import { environment } from '../../environments/environment';


const base_url: string = environment.base_url;

export class Clase {

    constructor( public uid: string,
                 public uidCentro?: string,
                 public nombre?: string,
                 public arrayAsignaturasProfesores?: string,
                 public arrayProfesores?: Array<string>,
                 public expanded?: boolean,
                ) {}

}
