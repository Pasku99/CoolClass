import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Examen } from '../../../models/examen.model';
import { AlumnoService } from '../../../services/alumno.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hacer-examen-alumno',
  templateUrl: './hacer-examen-alumno.page.html',
  styleUrls: ['./hacer-examen-alumno.page.scss'],
})
export class HacerExamenAlumnoPage implements OnInit {

  public uidExamen: string = '';
  public nombreExamen: string = '';
  public arrayPreguntas: Array<any> = new Array<any>();
  public arrayRespuestas: Array<any> = new Array<any>();
  public pregunta: string = '';
  public contador: number = 0;
  public acabado: boolean = true;
  public hecho: boolean = false;
  public respondidas: Array<any> = new Array<any>();
  public respuesta1: string = '';
  public respuesta2: string = '';
  public respuesta3: string = '';
  public respuesta4: string = '';
  public uidProfesor: string = '';
  public counter = 0;
  public fechaComienzo: Date = new Date();
  public fechaFinal: Date = new Date();
  private tiempoAgotado: boolean = false;
  public tiempominsegs: string = '';

  constructor(private alumnoService: AlumnoService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.uidProfesor = this.route.snapshot.params['idProfesor'];
    this.uidExamen = this.route.snapshot.params['idExamen'];
    this.cargarExamen();
  }

  mensajeConfirmacion(valor){
    Swal.fire({
      title: '¿Estás seguro/a?',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: '#004dff',
      cancelButtonText: 'No',
      cancelButtonColor: 'red',
      allowOutsideClick: false,
      heightAuto: false,
    }).then((result) => {
      if (result.value) {
        this.respuesta(valor);
      }
    });
  }

  cargarExamen(){
    this.alumnoService.cargarExamenAlumno(this.uidExamen, this.alumnoService.uid, this.alumnoService.uidCentro)
      .subscribe(res => {
        this.nombreExamen = res['nombreExamen'];
        this.arrayPreguntas = res['preguntas'];
        this.arrayRespuestas = res['respuestasAleatorias'];
        this.pregunta=this.arrayPreguntas[0];
        this.respuesta1 = this.arrayRespuestas[0][0];
        this.respuesta2 = this.arrayRespuestas[0][1];
        this.respuesta3 = this.arrayRespuestas[0][2];
        this.respuesta4 = this.arrayRespuestas[0][3];
        for(let i = 0; i < this.arrayPreguntas.length; i++){
          this.respondidas.push('');
        }
        let fechaActual = new Date().toISOString();
        this.fechaFinal = res['fechaFinal'];
        let fechaFinalContador = new Date(this.fechaFinal).toISOString();
        this.counter = Date.parse(fechaFinalContador) - Date.parse(fechaActual);
        this.counter = this.counter/1000;
        this.counter = Math.round(this.counter);
        this.cronometro();
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }

  next() :void {
    for(let i = 0; i< this.respondidas.length; i++){
      if(this.respondidas[i] == ''){
        this.acabado = false;
        break;
      }else{
        this.acabado = true;
      }
    }

    if(!this.acabado){
      if(this.contador == this.arrayPreguntas.length-1){
        this.contador=0;
      }else{
        this.contador=this.contador+1;
      }
      this.pregunta = this.arrayPreguntas[this.contador];
      this.respuesta1 = this.arrayRespuestas[this.contador][0];
      this.respuesta2 = this.arrayRespuestas[this.contador][1];
      this.respuesta3 = this.arrayRespuestas[this.contador][2];
      this.respuesta4 = this.arrayRespuestas[this.contador][3];
    }else{
      this.enviarExamen(this.tiempoAgotado);
    }
  }

enviarExamen(tiempoAgotado){
    const data = {
      uidAlumno : this.alumnoService.uid,
      uidExamen: this.uidExamen,
      uidProfesor: this.uidProfesor,
      uidClase: this.alumnoService.uidClase,
      respuestasCorrectas: this.respondidas
    };
    this.alumnoService.enviarExamenResuelto(data)
      .subscribe(res => {
        if(!tiempoAgotado){
          Swal.fire({
            title: 'Examen finalizado',
            text: 'Puede ya consultar su nota.',
            showCancelButton: false,
            confirmButtonText: 'Vale',
            confirmButtonColor: '#004dff',
            allowOutsideClick: false,
            heightAuto: false,
          }).then((result) => {
            if (result.value) {
              this.router.navigateByUrl('/tabs-alumno/asignaturas/info-asignatura/' + res['examenResuelto'].asignatura);
            }
          });
        } else {
          Swal.fire({
            title: 'Examen finalizado. Se le acabó el tiempo.',
            text: 'Puede ya consultar su nota.',
            showCancelButton: false,
            confirmButtonText: 'Vale',
            confirmButtonColor: '#004dff',
            allowOutsideClick: false,
            heightAuto: false,
          }).then((result) => {
            if (result.value) {
              this.router.navigateByUrl('/tabs-alumno/asignaturas/info-asignatura/' + res['examenResuelto'].asignatura);
            }
          });
        }
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }

  respuesta(valor) :void{
    this.respondidas[this.contador] = valor;
    this.next();
  }

  cronometro(){
    let intervalId = setInterval(() => {
      this.counter = this.counter - 1;
      // console.log(this.counter)
      let minutes = Math.floor(this.counter / 60);
      let seconds = this.counter - minutes * 60;
      this.tiempominsegs = this.str_pad_left(minutes,'0',2)+':'+this.str_pad_left(seconds,'0',2);
      if(this.counter === 0){
        for(let i = 0; i < this.respondidas.length; i++){
          if(this.respondidas[i] == ''){
            this.respondidas[i] = 'No responder';
          }
        }
        this.tiempoAgotado = true;
        this.enviarExamen(this.tiempoAgotado);
        clearInterval(intervalId);
      }
    }, 1000)
  }

  str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
  }

}
