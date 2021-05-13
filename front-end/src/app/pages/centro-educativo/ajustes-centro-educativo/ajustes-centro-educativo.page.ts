import { Component, OnInit } from '@angular/core';
import { CentroeducativoService } from '../../../services/centroeducativo.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajustes-centro-educativo',
  templateUrl: './ajustes-centro-educativo.page.html',
  styleUrls: ['./ajustes-centro-educativo.page.scss'],
})
export class AjustesCentroEducativoPage implements OnInit {

  constructor(private centroeducativoService: CentroeducativoService,
              private router: Router) { }

  ngOnInit() {
  }

  eliminarCentroModal(){
    Swal.fire({
      title: '¿Está seguro/a?',
      text: 'Se borrarán todos los datos asociados al centro, incluyendo cuentas de profesor, alumno, exámenes y notas.',
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
          title: 'Eliminar cuenta de centro educativo',
          text: `Introduzca la contraseña de su cuenta para eliminar el centro educativo`,
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
              uid: this.centroeducativoService.uid,
              password: password
            }
            this.centroeducativoService.comprobarPasswordCentro(data)
              .subscribe(res => {
                this.eliminarCentro();
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
      title: 'Eliminar cuenta de centro educativo',
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
          uid: this.centroeducativoService.uid,
          password: password
        }
        this.centroeducativoService.comprobarPasswordCentro(data)
          .subscribe(res => {
            this.eliminarCentro();
          }, (err) => {
            this.passwordIncorrectaEliminar();
          });
      }
    });
  }

  eliminarCentro(){
    this.centroeducativoService.eliminarCentro(this.centroeducativoService.uid)
      .subscribe(res => {
        this.router.navigateByUrl('/inicio');
        Swal.fire({
          title: 'Centro educativo eliminado con éxito',
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
