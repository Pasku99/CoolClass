import { Component, OnInit } from '@angular/core';
import { CentroeducativoService } from '../../../services/centroeducativo.service';
import { ActivatedRoute } from '@angular/router';
import { Alumno } from '../../../models/alumno.model';
import { Clase } from '../../../models/clase.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clase-alumnos-centro-educativo',
  templateUrl: './clase-alumnos-centro-educativo.page.html',
  styleUrls: ['./clase-alumnos-centro-educativo.page.scss'],
})
export class ClaseAlumnosCentroEducativoPage implements OnInit {

  public items: any = [];
  public uidClase: string = '';
  public alumnos: Alumno[] = [];
  public listaDesplegable: Alumno[] = [];
  public filtro: string = '';
  public clase: Clase = new Clase('');
  public nombreClase: string = '';

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
      this.alumnos.map(listItem => {
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
    this.uidClase = this.route.snapshot.params['idClase'];
    this.cargarClase();
    this.cargarAlumnosClase(this.centroeducativoService.uid, this.uidClase);
  }

  cargarAlumnosClase(uidCentro, uidClase){
    this.centroeducativoService.cargarAlumnosClase(uidCentro, uidClase)
      .subscribe( res => {
        this.alumnos = res['alumnos'];
        this.listaDesplegable = res['alumnos'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarAlumnosClaseFiltro(uidCentro, uidClase, nombreProf){
    this.centroeducativoService.cargarAlumnosClase(uidCentro, uidClase, nombreProf)
      .subscribe( res => {
        this.alumnos = res['alumnos'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  filtrarNombre($event){
    this.filtro = $event.target.value;
    if(this.filtro == 'Todos'){
      this.filtro = '';
      this.cargarAlumnosClase(this.centroeducativoService.uid, this.uidClase);
    } else {
      this.cargarAlumnosClaseFiltro(this.centroeducativoService.uid, this.uidClase, this.filtro);
    }
  }

  cargarClase(){
    this.centroeducativoService.cargarClasesUid(this.centroeducativoService.uid, this.uidClase)
      .subscribe(res => {
        this.clase = res['arrayClases'];
        this.nombreClase = this.clase[0].nombre;
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }


}
