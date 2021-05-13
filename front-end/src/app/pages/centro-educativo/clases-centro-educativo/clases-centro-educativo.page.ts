import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Clase } from 'src/app/models/clase.model';
import Swal from 'sweetalert2'
import { CentroeducativoService } from '../../../services/centroeducativo.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-clases-centro-educativo',
  templateUrl: './clases-centro-educativo.page.html',
  styleUrls: ['./clases-centro-educativo.page.scss'],
})
export class ClasesCentroEducativoPage implements OnInit {

  public items: any = [];
  public filtro: string = '';
  public listaClases: Clase[] = [];
  public listaDesplegable: Clase[] = [];

  constructor(private centroeducativoService: CentroeducativoService,
              private authService: AuthService) {
    this.items = [
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false }
    ];
  }

  expandItem(item): void {
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.listaClases.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }

  ngOnInit(){
    // this.changeRef.detectChanges();
    // this.cargarClases(this.centroeducativoService.uid, this.filtro);
  }

  ionViewWillEnter(){
    this.cargarClases(this.centroeducativoService.uid, this.filtro);
  }

  anyadirClase(){
    Swal.fire({
      title: 'AÑADIR CLASE',
      input: "text",
      showCancelButton: true,
      // confirmButtonText: '<p style="color: black; font-size: 17px;">Añadir clase</p>',
      confirmButtonText: 'Añadir clase',
      confirmButtonColor: '#004dff',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'black',
      allowOutsideClick: false,
      heightAuto: false,
      // background: '#004dff',
      inputValidator: text => {
        // Si el valor es válido, debes regresar undefined. Si no, una cadena
        if (!text) {
            return "Por favor, escriba bien la clase";
        } else {
            return undefined;
        }
      }
    }).then((result) => {
      if (result.value) {
        const data = {
          uidCentro : this.centroeducativoService.uid,
          nombre: result.value,
        };
        this.centroeducativoService.nuevaClase(data)
          .subscribe(res => {
            Swal.fire({
              title: '¡Añadida!',
              text: 'Clase añadida con éxito',
              icon: 'success',
              heightAuto: false
            });
            this.filtro = '';
            this.cargarClases(this.centroeducativoService.uid, this.filtro);
          }, (err) => {
            const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
            Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
            return;
          });
      }
    });
  }

  cargarClases(uid, filtro){
    let expanded = false;
    this.centroeducativoService.cargarClases(uid, filtro)
      .subscribe(res =>{
        this.listaDesplegable = res['arrayClases'];
        this.listaClases = res['arrayClases'];
      }, (err) =>{
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      });
  }

  cargarClasesFiltro(uid, filtro){
    let expanded = false;
    this.centroeducativoService.cargarClases(uid, filtro)
      .subscribe(res =>{
        this.listaClases = res['arrayClases'];
      }, (err) =>{
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      });
  }

  filtrarNombre($event){
    // console.log($event.target.value);
    this.filtro = $event.target.value;
    if(this.filtro == 'Todas'){
      this.filtro = '';
      this.cargarClases(this.centroeducativoService.uid, this.filtro);
    } else {
      this.cargarClasesFiltro(this.centroeducativoService.uid, this.filtro);
    }
  }

  eliminarClaseModal(uidClase, nombre){
    Swal.fire({
      title: '¿Está seguro/a?',
      text: 'Se borrarán todos los datos asociados a la clase ' + nombre + ', incluyendo exámenes y notas.',
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
          title: 'Eliminar clase ' + nombre,
          text: `Introduzca la contraseña de su cuenta para eliminar la clase`,
          input: "password",
          confirmButtonText: 'Entrar',
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
                this.eliminarClase(uidClase, nombre);
              }, (err) => {
                this.passwordIncorrectaGestionar(uidClase, nombre);
              });
          }
        });
      }
    });
  }

  passwordIncorrectaGestionar(uidClase, nombre){
    Swal.fire({
      title: 'Eliminar clase ' + nombre,
      text: 'Contraseña incorrecta. Por favor, vuelva a intentarlo.',
      icon: 'error',
      input: "password",
      confirmButtonText: 'Entrar',
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
            this.eliminarClase(uidClase, nombre);
          }, (err) => {
            this.passwordIncorrectaGestionar(uidClase, nombre);
          });
      }
    });
  }

  eliminarClase(uidClase, nombre){
    this.centroeducativoService.eliminarClase(this.centroeducativoService.uid, uidClase)
      .subscribe(res => {
        Swal.fire({
          title: 'Clase ' + nombre + ' eliminada con éxito',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Vale',
          confirmButtonColor: '#004dff',
          allowOutsideClick: false,
          heightAuto: false,
        });
        this.filtro = '';
        this.cargarClases(this.centroeducativoService.uid, this.filtro);
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }

}
