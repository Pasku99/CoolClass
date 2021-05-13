import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../../services/alumno.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-mis-asignaturas-alumno',
  templateUrl: './mis-asignaturas-alumno.page.html',
  styleUrls: ['./mis-asignaturas-alumno.page.scss'],
})
export class MisAsignaturasAlumnoPage implements OnInit {

  public listaAsignaturas : Array<String> = new Array<String>();
  public listaAsignaturasMayus : Array<String> = new Array<String>();

  constructor(private alumnoService: AlumnoService,
              private authService: AuthService) { }

  ngOnInit() { }

  ionViewWillEnter(){
    this.cargarAsignaturas();
  }

  cargarAsignaturas(){
    if(this.alumnoService.uidClase){
      this.alumnoService.cargarAsignaturasAlumno(this.alumnoService.uid, this.alumnoService.uidClase)
        .subscribe(res => {
          this.listaAsignaturas = res['asignaturas'];
          this.listaAsignaturasMayus = [];
          for(let i = 0; i < this.listaAsignaturas.length; i++){
            this.listaAsignaturasMayus.push(this.listaAsignaturas[i].toUpperCase());
          }
        }, (err => {
          const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
          return;
        }));
    } else {
      this.listaAsignaturasMayus = [];
    }
  }

}
