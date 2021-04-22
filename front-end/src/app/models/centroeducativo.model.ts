
import { environment } from '../../environments/environment';


const base_url: string = environment.base_url;

export class CentroEducativo {

    constructor( public uid: string,
                 public nombre?: string,
                 public email?: string,
                 public rol?: string,
                 public codigoProfesor?: string,
                 public codigoAlumno?: string,
                 public token?: string,
                ) {}

}
