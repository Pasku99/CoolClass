
import { environment } from '../../environments/environment';


const base_url: string = environment.base_url;

export class Asignatura {

    constructor( public nombre?: string,
                 public expanded?: boolean,
                ) {}

}
