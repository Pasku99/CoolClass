import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AlumnoService } from '../../../services/alumno.service';
import { ActivatedRoute } from '@angular/router';
import { ProfesorService } from '../../../services/profesor.service';
import { ExamenResuelto } from '../../../models/examenresuelto.model';

@Component({
  selector: 'app-comprobar-examen-profesor',
  templateUrl: './comprobar-examen-profesor.page.html',
  styleUrls: ['./comprobar-examen-profesor.page.scss'],
})
export class ComprobarExamenProfesorPage implements OnInit {

  public uidExamenResuelto: string = '';
  public uidAlumno: string = '';
  public nombreExamen: string = '';
  public arrayPreguntas: Array<any> = new Array<any>();
  public arrayRespuestas: Array<any> = new Array<any>();
  public arrayRespuestasAlumno: Array<any> = new Array<any>();
  public pregunta: string = '';
  public contador: number = 0;
  public acabado: boolean = true;
  public hecho: boolean = false;
  public respondidas: Array<any> = new Array<any>();
  public respuesta1: string = '';
  public respuesta2: string = '';
  public respuesta3: string = '';
  public respuesta4: string = '';
  public examenesResueltos: ExamenResuelto[] = [];


  constructor(private alumnoService: AlumnoService,
              private route: ActivatedRoute,
              private profesorService: ProfesorService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.uidAlumno = this.route.snapshot.params['idAlumno'];
    this.uidExamenResuelto = this.route.snapshot.params['idExamenResuelto'];
    this.cargarExamen();
  }

  mensajeConfirmacion(){
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

      }
    });
  }

  cargarExamen(){
    this.profesorService.cargarExamenResueltoAlumno(this.profesorService.uid, this.uidAlumno, this.uidExamenResuelto)
      .subscribe(res => {
        this.arrayRespuestasAlumno = res['examenesResueltos'][0].respuestas;
        // this.alumnoService.cargarExamenAlumno(res['examenesResueltos'][0].uidExamen, this.alumnoService.uid, this.alumnoService.uidCentro)
        //   .subscribe(res => {
        //     this.nombreExamen = res['nombreExamen'];
        //     this.arrayPreguntas = res['preguntas'];
        //     this.arrayRespuestas = res['respuestasAleatorias'];
        //     this.pregunta=this.arrayPreguntas[0];
        //     this.respuesta1 = this.arrayRespuestas[0][0];
        //     this.respuesta2 = this.arrayRespuestas[0][1];
        //     this.respuesta3 = this.arrayRespuestas[0][2];
        //     this.respuesta4 = this.arrayRespuestas[0][3];
        //     for(let i = 0; i < this.arrayPreguntas.length; i++){
        //       this.respondidas.push('');
        //     }
        //   }, (err => {
        //     const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        //     Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        //     return;
        //   }));
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
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
      this.pregunta = "EXAMEN ACABADO";
    }
  }

  respuesta(valor) :void{
    this.respondidas[this.contador] = valor;
    this.next();
  }

  cargarExamenesResueltosAlumno(){
    this.profesorService.cargarExamenesResueltosAlumno(this.profesorService.uid, this.uidAlumno)
      .subscribe(res => {
        this.examenesResueltos = res['examenesResueltos'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }

}
