import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../services/profesor.service';
import Swal from 'sweetalert2';
import { Clase } from 'src/app/models/clase.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-escoger-clases-config-profesor',
  templateUrl: './escoger-clases-config-profesor.page.html',
  styleUrls: ['./escoger-clases-config-profesor.page.scss'],
})
export class EscogerClasesConfigProfesorPage implements OnInit {

  public listaAsignaturas : Array<String> = new Array<String>();
  public listaClases: Array<String> = new Array<String>();
  public listaClasesNombres: Array<String> = new Array<String>();
  public listaClasesProfesor: Array<String> = new Array<String>();
  public listaAsignaturasEnUso: Array<String> = new Array<String>();
  public listaAsignaturasEnUsoProf: Array<String> = new Array<String>();
  public asignatura: string = '';
  public listaClasesModel: Clase[] = [];

  constructor(private profesorService: ProfesorService,
              private router: Router) { }

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
        this.listaClases = res['infoClasesNoProfesor'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarClasesProfesor(){
    this.profesorService.cargarClasesProfesor(this.profesorService.uidCentro, this.profesorService.uid)
      .subscribe( res => {
        this.listaClasesProfesor = res['infoClases'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  anyadirClaseProfesor( nombreClase ){
    const data = {
      nombreClase : nombreClase,
      uidCentro : this.profesorService.uidCentro,
      uidProfesor : this.profesorService.uid,
    };
    this.profesorService.anyadirClaseProfesor(data)
      .subscribe( res => {
        this.cargarClasesCentro();
        this.cargarClasesProfesor();
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false}).then((result) => {
          if(result.value) {
            this.cargarClasesCentro();
            this.cargarClasesProfesor();
          }
        })
      }));
  }

  escogerAsignatura(nombreClase){
    const data = {
      nombreClase : nombreClase,
      uidCentro : this.profesorService.uidCentro,
      uidProfesor : this.profesorService.uid,
      asignatura: this.asignatura,
    };
    this.profesorService.escogerAsignaturas(data)
      .subscribe( res => {
        this.cargarClasesCentro();
        this.cargarClasesProfesor();
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false}).then((result) => {
          if(result.value) {
            this.cargarClasesCentro();
            this.cargarClasesProfesor();
          }
        })
      }));
  }

  eliminarClaseProfesor(nombreClase, asignatura){
    const data = {
      nombreClase : nombreClase,
      uidCentro : this.profesorService.uidCentro,
      uidProfesor : this.profesorService.uid,
      asignatura: asignatura,
    };
    this.profesorService.eliminarClaseAsignaturaProfesor(data)
      .subscribe( res => {
        this.cargarClasesCentro();
        this.cargarClasesProfesor();
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cogerClase($event){
    this.asignatura = $event.target.value;
  }

}
