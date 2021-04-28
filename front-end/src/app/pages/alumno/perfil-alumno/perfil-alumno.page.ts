import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AlumnoService } from '../../../services/alumno.service';
import Swal from 'sweetalert2';
import { Clase } from 'src/app/models/clase.model';

@Component({
  selector: 'app-perfil-alumno',
  templateUrl: './perfil-alumno.page.html',
  styleUrls: ['./perfil-alumno.page.scss'],
})
export class PerfilAlumnoPage implements OnInit {

  public clase: string = '';
  public filtro: string = '';
  public listaClases: Clase[] = [];

  constructor(private authService: AuthService,
              private alumnoService: AlumnoService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.cargarClasesCentro();
  }

  logout(){
    this.authService.logout();
  }

  escogerClase(){
    const data = {
      uidAlumno : this.alumnoService.uid,
      uidCentro : this.alumnoService.uidCentro,
      nombreClase : this.clase,
    };
    this.alumnoService.escogerClase(data)
      .subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Clase cambiada con éxito',
          heightAuto: false
        });
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errtext,
        });
        return;
      }));
  }

  cogerClase($event){
    this.clase = $event.target.value;
  }

  cargarClasesCentro() {
    this.alumnoService.cargarClasesCentro(this.alumnoService.uidCentro, this.filtro, this.alumnoService.uid)
      .subscribe( res => {
        this.listaClases = res['arrayClases'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

}
