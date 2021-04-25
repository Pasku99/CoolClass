import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../services/profesor.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-escoger-asignaturas-config-profesor',
  templateUrl: './escoger-asignaturas-config-profesor.page.html',
  styleUrls: ['./escoger-asignaturas-config-profesor.page.scss'],
})
export class EscogerAsignaturasConfigProfesorPage implements OnInit {

  public listaAsignaturas : Array<String> = new Array<String>();

  constructor(private profesorService: ProfesorService) { }

  ngOnInit() {
    this.cargarAsignaturas();
  }

  cargarAsignaturas(){
    this.profesorService.cargarAsignaturas()
      .subscribe( res => {
        this.listaAsignaturas = res['asignaturas'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

}
