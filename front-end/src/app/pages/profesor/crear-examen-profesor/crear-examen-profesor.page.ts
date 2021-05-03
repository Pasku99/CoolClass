import { Component, OnInit } from '@angular/core';
import { readTask } from 'ionicons/dist/types/stencil-public-runtime';
import Swal from 'sweetalert2'
import { ProfesorService } from '../../../services/profesor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-crear-examen-profesor',
  templateUrl: './crear-examen-profesor.page.html',
  styleUrls: ['./crear-examen-profesor.page.scss'],
})
export class CrearExamenProfesorPage implements OnInit {

  public uidClase: string = '';
  public asignatura: string = '';
  public arrayPreguntas: Array<any> = new Array<any>();
  public respuestas: Array<any> = new Array<any>();
  public arrayRespuestas: Array<any> = new Array<any>();
  public nombreExamen: string = '';
  public fechaComienzo: Date;
  public fechaFinal: Date;

  constructor(private profesorService: ProfesorService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.uidClase = this.route.snapshot.params['idClase'];
    this.asignatura = this.route.snapshot.params['asignatura'];
  }

  anyadirPregunta(){
    Swal.fire({
      title: 'AÑADIR PREGUNTA',
      html: `<ion-row>
      <input type="text" id="pregunta" class="swal2-input" placeholder="Pregunta" style="background-color: #73c2fb;">
      </ion-row>
      <ion-row>
      <input type="text" id="respuesta1" class="swal2-input" placeholder="Respuesta 1 (CORRECTA)" style="background-color: #00ff7f;">
      </ion-row>
      <ion-row>
      <input type="text" id="respuesta2" class="swal2-input" placeholder="Respuesta 2">
      </ion-row>
      <ion-row>
      <input type="text" id="respuesta3" class="swal2-input" placeholder="Respuesta 3">
      </ion-row>
      <ion-row>
      <input type="text" id="respuesta4" class="swal2-input" placeholder="Respuesta 4">
      </ion-row>
      <style>
      .swal2-input::placeholder {
        color: rgba(0,0,0,0.6);
      }
      </style>`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      confirmButtonText: 'Añadir pregunta',
      allowOutsideClick: false,
      heightAuto: false,
      focusConfirm: false,
      preConfirm: () => {
        const pregunta = (<HTMLInputElement>Swal.getPopup().querySelector('#pregunta')).value;
        const respuesta1 = (<HTMLInputElement>Swal.getPopup().querySelector('#respuesta1')).value;
        const respuesta2 = (<HTMLInputElement>Swal.getPopup().querySelector('#respuesta2')).value;
        const respuesta3 = (<HTMLInputElement>Swal.getPopup().querySelector('#respuesta3')).value;
        const respuesta4 = (<HTMLInputElement>Swal.getPopup().querySelector('#respuesta4')).value;
        if (!pregunta || !respuesta1 || !respuesta2 || !respuesta3 || !respuesta4) {
          Swal.showValidationMessage(`Por favor, complete todos los campos.`)
        }
        return { pregunta: pregunta, respuesta1: respuesta1, respuesta2: respuesta2, respuesta3: respuesta3, respuesta4: respuesta4 }
      }
    }).then((result) => {
      if(result.value){
        this.arrayPreguntas.push(result.value.pregunta);
        this.respuestas = [];
        this.respuestas.push(result.value.respuesta1, result.value.respuesta2, result.value.respuesta3, result.value.respuesta4);
        this.arrayRespuestas.push(this.respuestas);
      }
    })
  }

  eliminarpregunta(i) {
    this.arrayPreguntas.splice(i, 1);
    this.arrayRespuestas.splice(i, 1);
  }

  verPregunta(i){
    Swal.fire({
      title: 'AÑADIR PREGUNTA',
      html: `<ion-row>
      <ion-input type="text" id="pregunta" class="swal2-input" placeholder="Pregunta" value="${this.arrayPreguntas[i]}" style="background-color: #73c2fb;"></ion-input>
      </ion-row>
      <ion-row>
      <ion-input type="text" id="respuesta1" class="swal2-input" placeholder="Respuesta 1" value="${this.arrayRespuestas[i][0]}" style="background-color: #00ff7f;"></ion-input>
      </ion-row>
      <ion-row>
      <ion-input type="text" id="respuesta2" class="swal2-input" placeholder="Respuesta 2" value="${this.arrayRespuestas[i][1]}"></ion-input>
      </ion-row>
      <ion-row>
      <ion-input type="text" id="respuesta3" class="swal2-input" placeholder="Respuesta 3" value="${this.arrayRespuestas[i][2]}"></ion-input>
      </ion-row>
      <ion-row>
      <ion-input type="text" id="respuesta4" class="swal2-input" placeholder="Respuesta 4" value="${this.arrayRespuestas[i][3]}"></ion-input>
      </ion-row>
      <style>
      .swal2-input::placeholder {
        color: rgba(0,0,0,0.6);
      }
      </style>`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      confirmButtonText: 'Editar pregunta',
      allowOutsideClick: false,
      heightAuto: false,
      focusConfirm: false,
      preConfirm: () => {
        const pregunta = (<HTMLInputElement>Swal.getPopup().querySelector('#pregunta')).value;
        const respuesta1 = (<HTMLInputElement>Swal.getPopup().querySelector('#respuesta1')).value;
        const respuesta2 = (<HTMLInputElement>Swal.getPopup().querySelector('#respuesta2')).value;
        const respuesta3 = (<HTMLInputElement>Swal.getPopup().querySelector('#respuesta3')).value;
        const respuesta4 = (<HTMLInputElement>Swal.getPopup().querySelector('#respuesta4')).value;
        if (!pregunta || !respuesta1 || !respuesta2 || !respuesta3 || !respuesta4) {
          Swal.showValidationMessage(`Aquí puede editar todos los campos.`)
        }
        return { pregunta: pregunta, respuesta1: respuesta1, respuesta2: respuesta2, respuesta3: respuesta3, respuesta4: respuesta4 }
      }
    }).then((result) => {
      if(result.value){
        this.arrayPreguntas[i] = result.value.pregunta;
        this.respuestas = [];
        this.respuestas.push(result.value.respuesta1, result.value.respuesta2, result.value.respuesta3, result.value.respuesta4);
        this.arrayRespuestas[i] = this.respuestas;
      }
    })
  }

  enviarPregunta(){
    const data = {
      uidProfesor : this.profesorService.uid,
      uidClase : this.uidClase,
      asignatura: this.asignatura,
      nombreExamen: this.nombreExamen,
      preguntas: this.arrayPreguntas,
      respuestas: this.arrayRespuestas,
      fechaComienzo: this.fechaComienzo,
      fechaFinal: this.fechaFinal
    };

    this.profesorService.crearExamen(data)
      .subscribe(res => {
        console.log('Examen registrado con éxito');
        Swal.fire({
          icon: 'success',
          title: 'Examen registrado con éxito',
          heightAuto: false
        }).then((result) => {
          if (result.value) {
            this.router.navigateByUrl('/tabs-profesor/clases');
          }
        });;
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

}
