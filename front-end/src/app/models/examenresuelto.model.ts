
import { environment } from '../../environments/environment';


const base_url: string = environment.base_url;

export class ExamenResuelto {

    constructor( public uid: string,
                 public uidAlumno?: string,
                 public uidExamen?: string,
                 public uidProfesor?: string,
                 public uidClase?: string,
                 public nombreClase?: string,
                 public nota?: string,
                 public asignatura?: string,
                 public nombreExamen?: string,
                 public nombreAlumno?: string,
                 public expanded?: boolean,
                ) {}

}
