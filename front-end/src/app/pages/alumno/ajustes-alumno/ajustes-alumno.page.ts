import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AlumnoService } from '../../../services/alumno.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajustes-alumno',
  templateUrl: './ajustes-alumno.page.html',
  styleUrls: ['./ajustes-alumno.page.scss'],
})
export class AjustesAlumnoPage implements OnInit {

  constructor(private alumnoService: AlumnoService,
              private router: Router) { }

  ngOnInit() {
  }

  eliminarAlumnoModal(){
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
          title: 'Eliminar cuenta de alumno',
          text: `Introduzca la contraseña de su cuenta para eliminar su usuario alumno`,
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
              uid: this.alumnoService.uid,
              password: password
            }
            this.alumnoService.comprobarPasswordAlumno(data)
              .subscribe(res => {
                this.eliminarAlumno();
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
      title: 'Eliminar cuenta de alumno',
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
          uid: this.alumnoService.uid,
          password: password
        }
        this.alumnoService.comprobarPasswordAlumno(data)
          .subscribe(res => {
            this.eliminarAlumno();
          }, (err) => {
            this.passwordIncorrectaEliminar();
          });
      }
    });
  }

  eliminarAlumno(){
    this.alumnoService.eliminarAlumno(this.alumnoService.uid)
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
