
import { environment } from '../../environments/environment';


const base_url: string = environment.base_url;

export class Examen {

    constructor( public uid: string,
                 public uidProfesor?: string,
                 public uidClase?: string,
                 public nombreClase?: string,
                 public asignatura?: string,
                 public nombreExamen?: string,
                 public preguntas?: Array<string>,
                 public respuestas?: Array<string>,
                 public fechaComienzo?: Date,
                 public fechaFinal?: Date,
                 public expanded?: boolean,
                ) {}

}
