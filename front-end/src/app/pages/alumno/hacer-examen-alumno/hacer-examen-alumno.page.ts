import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hacer-examen-alumno',
  templateUrl: './hacer-examen-alumno.page.html',
  styleUrls: ['./hacer-examen-alumno.page.scss'],
})
export class HacerExamenAlumnoPage implements OnInit {

  constructor() { }

  ngOnInit() {
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

}
