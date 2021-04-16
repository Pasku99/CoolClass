import { Component, OnInit } from '@angular/core';
import { readTask } from 'ionicons/dist/types/stencil-public-runtime';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-crear-examen-profesor',
  templateUrl: './crear-examen-profesor.page.html',
  styleUrls: ['./crear-examen-profesor.page.scss'],
})
export class CrearExamenProfesorPage implements OnInit {

  constructor() { }

  ngOnInit() {
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
      Swal.fire(`
        Pregunta: ${result.value.pregunta}
        Respuesta 1: ${result.value.respuesta1}
        Respuesta 2: ${result.value.respuesta2}
        Respuesta 3: ${result.value.respuesta3}
        Respuesta 4: ${result.value.respuesta4}
      `.trim())
    })
  }

}
