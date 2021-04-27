import { Component, OnInit } from '@angular/core';
import { Asignatura } from 'src/app/models/asignatura.model';
import { MisClases } from 'src/app/models/misclases.model';
import { ProfesorService } from '../../../services/profesor.service';

@Component({
  selector: 'app-mis-clases-profesor',
  templateUrl: './mis-clases-profesor.page.html',
  styleUrls: ['./mis-clases-profesor.page.scss'],
})
export class MisClasesProfesorPage implements OnInit {

  public items: any = [];
  public filtro: string = '';
  public listaClasesProfesor: MisClases[] = [];
  public listaDesplegable: MisClases[] = [];
  public listaAsignaturasEnUso: Array<string> = new Array<string>();
  public listaAsignaturasEnUsoProf: Asignatura[] = [];

  constructor(private profesorService: ProfesorService) {
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
      this.listaClasesProfesor.map(listItem => {
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
    this.cargarClases(this.profesorService.uidCentro, this.profesorService.uid, this.filtro);
  }

  cargarClases(uidCentro, uidProfesor, filtro){
    this.profesorService.cargarClasesProfesor(uidCentro, uidProfesor, filtro)
      .subscribe(res =>{
        this.listaClasesProfesor = [];
        this.listaAsignaturasEnUsoProf = [];
        this.listaDesplegable = [];
        this.listaAsignaturasEnUso = res['asignaturas'];
        for(let i = 0; i <  this.listaAsignaturasEnUso.length; i = i + 2){
          let clases = {nombre: this.listaAsignaturasEnUso[i], expanded: false};
          this.listaDesplegable.push(clases);
        }
        for(let i = 0; i <  this.listaAsignaturasEnUso.length; i = i + 2){
          let clases = {nombre: this.listaAsignaturasEnUso[i], expanded: false};
          this.listaClasesProfesor.push(clases);
        }
        for(let i = 1; i <  this.listaAsignaturasEnUso.length; i = i + 2){
          let asignaturas = {nombre: this.listaAsignaturasEnUso[i], expanded: false};
          this.listaAsignaturasEnUsoProf.push(asignaturas);
        }
        // Ordenar alfabeticamente los arrays
        this.listaDesplegable = this.listaDesplegable.sort(function(a, b) {
          if (a.nombre < b.nombre) { return -1; }
          if (a.nombre > b.nombre) { return 1; }
          return 0;
        });

        this.listaClasesProfesor = this.listaClasesProfesor.sort(function(a, b) {
          if (a.nombre < b.nombre) { return -1; }
          if (a.nombre > b.nombre) { return 1; }
          return 0;
        });

        this.listaAsignaturasEnUsoProf = this.listaAsignaturasEnUsoProf.sort(function(a, b) {
          if (a.nombre < b.nombre) { return -1; }
          if (a.nombre > b.nombre) { return 1; }
          return 0;
        });
      }, (err) =>{

      });
  }

  cargarClasesFiltro(uidCentro, uidProfesor, filtro){
    this.profesorService.cargarClasesProfesor(uidCentro, uidProfesor, filtro)
      .subscribe(res =>{
        this.listaClasesProfesor = [];
        this.listaAsignaturasEnUsoProf = [];
        this.listaAsignaturasEnUso = res['asignaturas'];
        for(let i = 0; i <  this.listaAsignaturasEnUso.length; i = i + 2){
          let clases = {nombre: this.listaAsignaturasEnUso[i], expanded: false};
          this.listaClasesProfesor.push(clases);
        }
        for(let i = 1; i <  this.listaAsignaturasEnUso.length; i = i + 2){
          let asignaturas = {nombre: this.listaAsignaturasEnUso[i], expanded: false};
          this.listaAsignaturasEnUsoProf.push(asignaturas);
        }
      }, (err) =>{

      });
  }

  filtrarNombre($event){
    this.filtro = $event.target.value;
    if(this.filtro == 'Todas'){
      this.filtro = '';
      this.cargarClases(this.profesorService.uidCentro, this.profesorService.uid, this.filtro);
    } else {
      this.cargarClasesFiltro(this.profesorService.uidCentro, this.profesorService.uid, this.filtro);
    }
  }

}
