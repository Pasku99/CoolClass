import { Component, OnInit } from '@angular/core';
import { CentroeducativoService } from '../../../services/centroeducativo.service';
import { ActivatedRoute } from '@angular/router';
import { Profesor } from '../../../models/profesor.model';
import Swal from 'sweetalert2';
import { Clase } from 'src/app/models/clase.model';
import { MisClases } from '../../../models/misclases.model';
import { ProfesorClase } from '../../../models/profesorclase.model';

@Component({
  selector: 'app-profesores-clase-centro-educativo',
  templateUrl: './profesores-clase-centro-educativo.page.html',
  styleUrls: ['./profesores-clase-centro-educativo.page.scss'],
})
export class ProfesoresClaseCentroEducativoPage implements OnInit {

  public items: any = [];
  public uidClase: string = '';
  public profesores: ProfesorClase[] = [];
  public listaDesplegable: Profesor[] = [];
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
    this.uidClase = this.route.snapshot.params['idClase'];
    this.cargarClase();
    this.cargarProfesoresClase(this.centroeducativoService.uid, this.uidClase);
  }

  cargarProfesoresClase(uidCentro, uidClase){
    this.centroeducativoService.cargarProfesoresClase(uidCentro, uidClase)
      .subscribe( res => {
        this.profesores = res['profesores'];
        this.listaDesplegable = res['profesores'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarProfesoresClaseFiltro(uidCentro, uidClase, nombreProf){
    this.centroeducativoService.cargarProfesoresClase(uidCentro, uidClase, nombreProf)
      .subscribe( res => {
        this.profesores = res['profesores'];
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
      this.cargarProfesoresClase(this.centroeducativoService.uid, this.uidClase);
    } else {
      this.cargarProfesoresClaseFiltro(this.centroeducativoService.uid, this.uidClase, this.filtro);
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

  // cargarAsignatura(idProfesor){
  //   this.centroeducativoService.cargarClasesProfesor(this.centroeducativoService.uid, idProfesor, this.clase[0].nombre)
  //     .subscribe(res => {
  //       this.listaClasesProfesor = res['infoClases'];
  //     }, (err => {
  //       const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
  //       Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
  //       return;
  //     }));
  // }

}
