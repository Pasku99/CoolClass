import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { ProfesorService } from '../../../services/profesor.service';

@Component({
  selector: 'app-ajustes-profesor',
  templateUrl: './ajustes-profesor.page.html',
  styleUrls: ['./ajustes-profesor.page.scss'],
})
export class AjustesProfesorPage implements OnInit {

  constructor(private profesorService: ProfesorService,
              private router: Router) { }

  ngOnInit() {
  }

  eliminarProfesorModal(){
    Swal.fire({
      title: '¿Está seguro/a?',
      text: 'Se borrarán todos los datos asociados al profesor, incluyendo exámenes y notas de los alumnos.',
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
          title: 'Eliminar cuenta de profesor',
          text: `Introduzca la contraseña de su cuenta para eliminar su usuario profesor`,
          input: "password",
          confirmButtonText: 'Eliminar',
          showCancelButton: true,
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          heightAuto: false,
          inputValidator: password => {
            // Si el valor es válido, debes regresar undefined. Si no, una cadena
            if (!password) {
                return "Por favor, escriba la contraseña";
            } else {
                return undefined;
            }
          }
        }).then((result) => {
          if(result.value){
            var password = result.value;
            const data = {
              uid: this.profesorService.uid,
              password: password
            }
            this.profesorService.comprobarPasswordProfesor(data)
              .subscribe(res => {
                this.eliminarProfesor();
              }, (err) => {
                this.passwordIncorrectaEliminar();
              });
          }
        });
      }
    });
  }

  passwordIncorrectaEliminar(){
    Swal.fire({
      title: 'Eliminar cuenta de profesor',
      text: 'Contraseña incorrecta. Por favor, vuelva a intentarlo.',
      icon: 'error',
      input: "password",
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      heightAuto: false,
      inputValidator: password => {
        // Si el valor es válido, debes regresar undefined. Si no, una cadena
        if (!password) {
            return "Por favor, escriba la contraseña.";
        } else {
            return undefined;
        }
      }
    }).then((result) => {
      if(result.value){
        var password = result.value;
        const data = {
          uid: this.profesorService.uid,
          password: password
        }
        this.profesorService.comprobarPasswordProfesor(data)
          .subscribe(res => {
            this.eliminarProfesor();
          }, (err) => {
            this.passwordIncorrectaEliminar();
          });
      }
    });
  }

  eliminarProfesor(){
    this.profesorService.eliminarProfesor(this.profesorService.uidCentro, this.profesorService.uid)
      .subscribe(res => {
        this.router.navigateByUrl('/inicio');
        Swal.fire({
          title: 'Cuenta eliminada con éxito',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Vale',
          confirmButtonColor: '#004dff',
          allowOutsideClick: false,
          heightAuto: false,
        });
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }


}
