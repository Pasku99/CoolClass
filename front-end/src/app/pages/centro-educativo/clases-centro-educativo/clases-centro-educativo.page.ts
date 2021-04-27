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

      });
  }

  cargarClasesFiltro(uid, filtro){
    let expanded = false;
    this.centroeducativoService.cargarClases(uid, filtro)
      .subscribe(res =>{
        this.listaClases = res['arrayClases'];
      }, (err) =>{

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

}
