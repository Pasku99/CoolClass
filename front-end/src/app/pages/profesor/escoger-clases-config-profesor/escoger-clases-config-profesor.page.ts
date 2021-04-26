import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../services/profesor.service';
import Swal from 'sweetalert2';
import { Clase } from 'src/app/models/clase.model';

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
        this.listaClasesNombres = [];
        this.listaClases = res['clasesNoProfesor'];
        for(let i = 0; i <  this.listaClases.length; i = i + 2){
          this.listaClasesNombres.push(this.listaClases[i]);
        }
        console.log(this.listaClasesNombres);
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarClasesProfesor(){
    this.profesorService.cargarClasesProfesor(this.profesorService.uidCentro, this.profesorService.uid)
      .subscribe( res => {
        this.listaClasesProfesor = [];
        this.listaAsignaturasEnUsoProf = [];
        this.listaAsignaturasEnUso = res['asignaturas'];
        for(let i = 0; i <  this.listaAsignaturasEnUso.length; i = i + 2){
          this.listaClasesProfesor.push(this.listaAsignaturasEnUso[i]);
        }
        for(let i = 1; i <  this.listaAsignaturasEnUso.length; i = i + 2){
          this.listaAsignaturasEnUsoProf.push(this.listaAsignaturasEnUso[i]);
        }
        console.log(this.listaAsignaturasEnUsoProf)
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
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
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
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  eliminarClaseProfesor(nombreClase, asignatura){
    console.log(asignatura)
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
    console.log(this.asignatura);
  }

}
