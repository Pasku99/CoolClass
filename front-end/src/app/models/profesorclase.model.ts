
import { environment } from '../../environments/environment';


const base_url: string = environment.base_url;

export class ProfesorClase {

    constructor( public uidProfesor?: string,
                 public nombre?: string,
                 public asignatura?: string,
                 public expanded?: boolean,
                ) {}

}
