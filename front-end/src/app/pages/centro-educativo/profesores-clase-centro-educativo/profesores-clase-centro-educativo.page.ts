import { Component, OnInit } from '@angular/core';
import { CentroeducativoService } from '../../../services/centroeducativo.service';
import { ActivatedRoute } from '@angular/router';
import { Profesor } from '../../../models/profesor.model';

@Component({
  selector: 'app-profesores-clase-centro-educativo',
  templateUrl: './profesores-clase-centro-educativo.page.html',
  styleUrls: ['./profesores-clase-centro-educativo.page.scss'],
})
export class ProfesoresClaseCentroEducativoPage implements OnInit {

  public items: any = [];
  public uidClase: string = '';
  public profesores: Profesor[] = [];
  public listaDesplegable: Profesor[] = [];
  public filtro: string = '';

  constructor(private centroeducativoService: CentroeducativoService,
              private route: ActivatedRoute) {
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
      this.profesores.map(listItem => {
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
    this.uidClase = this.route.snapshot.params['idClase']
    this.cargarProfesoresClase(this.centroeducativoService.uid, this.uidClase);
  }

  cargarProfesoresClase(uidCentro, uidClase){
    this.centroeducativoService.cargarProfesoresClase(uidCentro, uidClase)
      .subscribe( res => {
        this.profesores = res['profesores'];
        this.listaDesplegable = res['profesores'];
      }, (err => {

      }));
  }

  cargarProfesoresClaseFiltro(uidCentro, uidClase, nombreProf){
    this.centroeducativoService.cargarProfesoresClase(uidCentro, uidClase, nombreProf)
      .subscribe( res => {
        this.profesores = res['profesores'];
      }, (err => {

      }));
  }

  filtrarNombre($event){
    this.filtro = $event.target.value;
    if(this.filtro == 'Todos'){
      this.filtro = '';
      this.cargarProfesoresClase(this.centroeducativoService.uid, this.uidClase);
    } else {
      this.cargarProfesoresClaseFiltro(this.centroeducativoService.uid, this.uidClase, this.filtro);
    }
  }

}
