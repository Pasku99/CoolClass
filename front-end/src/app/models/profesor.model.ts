
import { environment } from '../../environments/environment';


const base_url: string = environment.base_url;

export class Profesor {

    constructor( public uid: string,
                 public nombre?: string,
                 public email?: string,
                 public rol?: string,
                 public uidCentro?: string,
                 public token?: string,
                ) {}

}