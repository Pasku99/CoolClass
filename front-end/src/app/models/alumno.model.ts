
import { environment } from '../../environments/environment';


const base_url: string = environment.base_url;

export class Alumno {

    constructor( public uid: string,
                 public nombre?: string,
                 public email?: string,
                 public rol?: string,
                 public uidCentro?: string,
                 public uidClase?: string,
                 public token?: string,
                 public expanded?: boolean,
                ) {}

}
