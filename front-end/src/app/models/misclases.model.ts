
import { environment } from '../../environments/environment';


const base_url: string = environment.base_url;

export class MisClases {

    constructor( public nombre?: string,
                 public asignatura?: string,
                 public uidClase?: string,
                 public expanded?: boolean,
                ) {}

}
