import { Component, OnInit } from '@angular/core';
import { ExamenResuelto } from '../../../models/examenresuelto.model';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ProfesorService } from '../../../services/profesor.service';
import { AlumnoService } from '../../../services/alumno.service';

@Component({
  selector: 'app-comprobar-examen-alumno',
  templateUrl: './comprobar-examen-alumno.page.html',
  styleUrls: ['./comprobar-examen-alumno.page.scss'],
})
export class ComprobarExamenAlumnoPage implements OnInit {

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
  public respuestaMarcada1: boolean = false;
  public respuestaMarcada2: boolean = false;
  public respuestaMarcada3: boolean = false;
  public respuestaMarcada4: boolean = false;
  public respuestaMarcadaNoResponder: boolean = false;
  public examenesResueltos: ExamenResuelto[] = [];

  constructor(private route: ActivatedRoute,
              private alumnoService: AlumnoService) { }

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
    this.alumnoService.cargarExamenResueltoAlumno(this.alumnoService.uid, this.uidExamenResuelto)
      .subscribe(res => {
        this.arrayRespuestasAlumno = res['examenResuelto'].respuestasCorrectas;
        this.nombreExamen = res['examenResuelto'].nombreExamen;
        this.arrayPreguntas = res['examenResuelto'].preguntas;
        this.arrayRespuestas = res['examenResuelto'].respuestas;
        this.pregunta=this.arrayPreguntas[0];
        this.respuesta1 = this.arrayRespuestas[0][0];
        this.respuesta2 = this.arrayRespuestas[0][1];
        this.respuesta3 = this.arrayRespuestas[0][2];
        this.respuesta4 = this.arrayRespuestas[0][3];
        this.comprobarRespuestas(0);
        for(let i = 0; i < this.arrayPreguntas.length; i++){
          this.respondidas.push('');
        }
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  next() :void {
    if(this.contador == this.arrayPreguntas.length-1){
      this.contador = this.arrayPreguntas.length-1;
    }else{
      this.contador=this.contador+1;
    }
    this.pregunta = this.arrayPreguntas[this.contador];
    this.respuesta1 = this.arrayRespuestas[this.contador][0];
    this.respuesta2 = this.arrayRespuestas[this.contador][1];
    this.respuesta3 = this.arrayRespuestas[this.contador][2];
    this.respuesta4 = this.arrayRespuestas[this.contador][3];
    this.comprobarRespuestas(this.contador);
  }

  previous() :void {
      if(this.contador == 0){
        this.contador=0;
      }else{
        this.contador=this.contador-1;
      }
      this.pregunta = this.arrayPreguntas[this.contador];
      this.respuesta1 = this.arrayRespuestas[this.contador][0];
      this.respuesta2 = this.arrayRespuestas[this.contador][1];
      this.respuesta3 = this.arrayRespuestas[this.contador][2];
      this.respuesta4 = this.arrayRespuestas[this.contador][3];
      this.comprobarRespuestas(this.contador);
  }

  respuestaSiguiente(valor) :void{
    this.respondidas[this.contador] = valor;
    this.next();
  }

  respuestaAnterior(valor) :void{
    this.respondidas[this.contador] = valor;
    this.previous();
  }

  // cargarExamenesResueltosAlumno(){
  //   this.profesorService.cargarExamenesResueltosAlumno(this.profesorService.uid, this.uidAlumno)
  //     .subscribe(res => {
  //       this.examenesResueltos = res['examenesResueltos'];
  //     }, (err => {
  //       const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
  //       Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
  //       return;
  //     }))
  // }

  comprobarRespuestas(i){
    if(this.respuesta1 === this.arrayRespuestasAlumno[i]){
      this.respuestaMarcada1 = true;
      this.respuestaMarcada2 = false;
      this.respuestaMarcada3 = false;
      this.respuestaMarcada4 = false;
      this.respuestaMarcadaNoResponder = false;
    } else if(this.respuesta2 == this.arrayRespuestasAlumno[i]){
      this.respuestaMarcada1 = false;
      this.respuestaMarcada2 = true;
      this.respuestaMarcada3 = false;
      this.respuestaMarcada4 = false;
      this.respuestaMarcadaNoResponder = false;
    } else if(this.respuesta3 == this.arrayRespuestasAlumno[i]){
      this.respuestaMarcada1 = false;
      this.respuestaMarcada2 = false;
      this.respuestaMarcada3 = true;
      this.respuestaMarcada4 = false;
      this.respuestaMarcadaNoResponder = false;
    } else if(this.respuesta4 == this.arrayRespuestasAlumno[i]){
      this.respuestaMarcada1 = false;
      this.respuestaMarcada2 = false;
      this.respuestaMarcada3 = false;
      this.respuestaMarcada4 = true;
      this.respuestaMarcadaNoResponder = false;
    } else if(this.arrayRespuestasAlumno[i] == 'No responder'){
      this.respuestaMarcada1 = false;
      this.respuestaMarcada2 = false;
      this.respuestaMarcada3 = false;
      this.respuestaMarcada4 = false;
      this.respuestaMarcadaNoResponder = true;
    }
  }

}
