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
      const data = {
        uidAlumno : this.alumnoService.uid,
        uidExamen: this.uidExamen,
        uidProfesor: this.uidProfesor,
        uidClase: this.alumnoService.uidClase,
        respuestasCorrectas: this.respondidas
      };
      this.alumnoService.enviarExamenResuelto(data)
        .subscribe(res => {
          Swal.fire({
            title: 'Examen finalizado',
            text: 'Podrá consultar su nota cuando acabe',
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
        }, (err => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
          return;
        }))
    }
  }

  respuesta(valor) :void{
    this.respondidas[this.contador] = valor;
    this.next();
  }

}
