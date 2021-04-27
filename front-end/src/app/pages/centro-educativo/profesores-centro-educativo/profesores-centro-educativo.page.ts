import { Component, OnInit } from '@angular/core';
import { Profesor } from 'src/app/models/profesor.model';
import { CentroeducativoService } from '../../../services/centroeducativo.service';
import { ProfesorService } from '../../../services/profesor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profesores-centro-educativo',
  templateUrl: './profesores-centro-educativo.page.html',
  styleUrls: ['./profesores-centro-educativo.page.scss'],
})
export class ProfesoresCentroEducativoPage implements OnInit {

  public items: any = [];
  public filtro: string = '';
  public listaProfesores: Profesor[] = [];
  public listaDesplegable: Profesor[] = [];
  public listaClasesProfesor: Array<String> = new Array<String>();
  public listaAsignaturasEnUso: Array<String> = new Array<String>();

  constructor(public centroeducativoService: CentroeducativoService,
              public profesorService: ProfesorService) {
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
      this.listaProfesores.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.cargarProfesores(this.centroeducativoService.uid, this.filtro);
  }

  cargarProfesores(uidCentro, filtro){
    this.centroeducativoService.cargarProfesores(uidCentro, filtro)
      .subscribe( res => {
        this.listaDesplegable = res['profesores'];
        this.listaProfesores = res['profesores'];
      }, (err => {

      }));
  }

  cargarProfesoresFiltro(uidCentro, filtro){
    this.centroeducativoService.cargarProfesores(uidCentro, filtro)
      .subscribe( res => {
        this.listaProfesores = res['profesores'];
      }, (err => {

      }));
  }

  filtrarNombre($event){
    this.filtro = $event.target.value;
    if(this.filtro == 'Todos'){
      this.filtro = '';
      this.cargarProfesores(this.centroeducativoService.uid, this.filtro);
    } else {
      this.cargarProfesoresFiltro(this.centroeducativoService.uid, this.filtro);
    }
  }

  cargarClasesProfesor(uidCentro, uidProfesor){
    this.centroeducativoService.cargarClasesProfesor(uidCentro, uidProfesor)
      .subscribe( res => {
        this.listaClasesProfesor = [];
        this.listaAsignaturasEnUso = res['asignaturas'];
        for(let i = 0; i <  this.listaAsignaturasEnUso.length; i = i + 2){
          this.listaClasesProfesor.push(this.listaAsignaturasEnUso[i]);
        }
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

}
