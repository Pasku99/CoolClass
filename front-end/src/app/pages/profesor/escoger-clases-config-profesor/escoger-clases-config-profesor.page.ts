import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../services/profesor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-escoger-clases-config-profesor',
  templateUrl: './escoger-clases-config-profesor.page.html',
  styleUrls: ['./escoger-clases-config-profesor.page.scss'],
})
export class EscogerClasesConfigProfesorPage implements OnInit {

  public listaAsignaturas : Array<String> = new Array<String>();
  public listaClases: Array<String> = new Array<String>();
  public listaClasesProfesor: Array<String> = new Array<String>();

  constructor(private profesorService: ProfesorService) { }

  ngOnInit() {
    this.cargarAsignaturas();
    this.cargarClasesCentro();
    this.cargarClasesProfesor();
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

  cargarClasesCentro() {
    this.profesorService.cargarClasesProfesor(this.profesorService.uidCentro, this.profesorService.uid)
      .subscribe( res => {
        this.listaClases = res['nombresNoProfesor'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarClasesProfesor(){
    this.profesorService.cargarClasesProfesor(this.profesorService.uidCentro, this.profesorService.uid)
      .subscribe( res => {
        this.listaClasesProfesor = res['nombres'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  anyadirClaseProfesor( nombreClase: string ){
    const data = {
      nombreClase : nombreClase,
      uidCentro : this.profesorService.uidCentro,
      uidProfesor : this.profesorService.uid,
    };
    this.profesorService.anyadirClaseProfesor(data)
      .subscribe( res => {
        this.cargarClasesProfesor();
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

}
