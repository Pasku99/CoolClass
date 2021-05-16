import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AlumnoService } from '../../../services/alumno.service';
import Swal from 'sweetalert2';
import { Clase } from 'src/app/models/clase.model';
import { Alumno } from '../../../models/alumno.model';

@Component({
  selector: 'app-perfil-alumno',
  templateUrl: './perfil-alumno.page.html',
  styleUrls: ['./perfil-alumno.page.scss'],
})
export class PerfilAlumnoPage implements OnInit {

  public clase: string = '';
  public filtro: string = '';
  public listaClases: Clase[] = [];
  public alumno: Alumno;

  constructor(private authService: AuthService,
              public alumnoService: AlumnoService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.cargarClasesCentro();
  }

  logout(){
    this.authService.logout();
  }

  escogerClase(){
    Swal.fire({
      title: '¿Está seguro/a?',
      text: 'Se borrarán todos los datos asociados al alumno, incluyendo exámenes realizados y notas.',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#004dff',
      allowOutsideClick: false,
      heightAuto: false,
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: 'Cambiar clase del alumno',
          text: `Introduzca el código de alumno proporcionado por el centro para cambiar su clase.`,
          input: "password",
          confirmButtonText: 'Cambiar',
          showCancelButton: true,
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          heightAuto: false,
          inputValidator: password => {
            // Si el valor es válido, debes regresar undefined. Si no, una cadena
            if (!password) {
                return "Por favor, escriba el código de alumno proporcionado por el centro";
            } else {
                return undefined;
            }
          }
        }).then((result) => {
          if(result.value){
            let codigo = result.value;
            const data = {
              uidAlumno : this.alumnoService.uid,
              uidCentro : this.alumnoService.uidCentro,
              nombreClase : this.clase,
              codigo: codigo
            };
            this.alumnoService.escogerClase(data)
              .subscribe(res => {
                this.alumnoService.establecerClase(res['nuevaClase'], this.clase);
                Swal.fire({
                  icon: 'success',
                  title: 'Clase cambiada con éxito',
                  heightAuto: false
                });
              }, (err => {
                this.codigoIncorrectoCambiar();
              }));
          }
        });
      }
    });
  }

  codigoIncorrectoCambiar(){
    Swal.fire({
      title: 'Código de alumno incorrecto.',
      text: `Por favor, introduzca el código de alumno proporcionado por el centro para cambiar su clase.`,
      icon: 'error',
      input: "password",
      confirmButtonText: 'Cambiar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      heightAuto: false,
      inputValidator: password => {
        // Si el valor es válido, debes regresar undefined. Si no, una cadena
        if (!password) {
            return "Por favor, escriba un código de alumno válido";
        } else {
            return undefined;
        }
      }
    }).then((result) => {
      if(result.value){
        let codigo = result.value;
        const data = {
          uidAlumno : this.alumnoService.uid,
          uidCentro : this.alumnoService.uidCentro,
          nombreClase : this.clase,
          codigo: codigo
        };
        this.alumnoService.escogerClase(data)
          .subscribe(res => {
            this.alumnoService.establecerClase(res['nuevaClase'], this.clase);
            Swal.fire({
              icon: 'success',
              title: 'Clase cambiada con éxito',
              heightAuto: false
            });
          }, (err => {
            this.codigoIncorrectoCambiar();
          }));
      }
    });
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
