import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../services/profesor.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Examen } from 'src/app/models/examen.model';
import { Clase } from '../../../models/clase.model';

@Component({
  selector: 'app-mis-examenes-profesor',
  templateUrl: './mis-examenes-profesor.page.html',
  styleUrls: ['./mis-examenes-profesor.page.scss'],
})
export class MisExamenesProfesorPage implements OnInit {

  public items: any = [];
  public uidClase: string = '';
  public examenesClase: Examen[] = [];
  public asignatura: string = '';
  public nombreClase: string = '';
  public nombreExamen: string = '';
  public proximosExamenes: Examen[] = [];
  public clase: Clase = new Clase('');

  constructor(private profesorService: ProfesorService,
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
      this.proximosExamenes.map(listItem => {
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
    this.asignatura = this.route.snapshot.params['asignatura'];
    this.nombreExamen = this.route.snapshot.params['nombreExamen'];
    this.cargarClase();
    if(this.nombreExamen){
      this.cargarProximosExamenesFiltro(this.nombreExamen);
    } else {
      this.cargarProximosExamenes();
    }
  }

  cargarProximosExamenes(){
    this.profesorService.cargarProximosExamenes(this.profesorService.uid, this.uidClase)
      .subscribe(res => {
        this.proximosExamenes = res['proximosExamenes'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarProximosExamenesFiltro(filtro){
    this.profesorService.cargarProximosExamenes(this.profesorService.uid, this.uidClase, filtro)
      .subscribe(res => {
        this.proximosExamenes = res['proximosExamenes'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarClase(){
    this.profesorService.cargarClasesUid(this.profesorService.uidCentro, this.profesorService.uid, this.uidClase)
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
