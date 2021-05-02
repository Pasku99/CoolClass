import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CentroeducativoService } from '../../../services/centroeducativo.service';
import Swal from 'sweetalert2'
import { Alumno } from '../../../models/alumno.model';
import { Clase } from '../../../models/clase.model';
import { ExamenResuelto } from 'src/app/models/examenresuelto.model';

@Component({
  selector: 'app-clase-alumnos-notas-centro-educativo',
  templateUrl: './clase-alumnos-notas-centro-educativo.page.html',
  styleUrls: ['./clase-alumnos-notas-centro-educativo.page.scss'],
})
export class ClaseAlumnosNotasCentroEducativoPage implements OnInit {

  public items: any = [];
  public uidAlumno: string = '';
  public uidClase: string = '';
  public alumno: Alumno = new Alumno('');
  public clase: Clase = new Clase('');
  public nombreClase: string = '';
  public examenesResueltos: ExamenResuelto[] = [];

  constructor(private route: ActivatedRoute,
              private centroeducativoService: CentroeducativoService) {
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
      this.examenesResueltos.map(listItem => {
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
    this.uidAlumno = this.route.snapshot.params['idAlumno'];
    this.cargarAlumno();
    this.uidClase = this.route.snapshot.params['idClase'];
    this.cargarClase();
    this.cargarExamenesResueltos();
  }

  cargarAlumno(){
    this.centroeducativoService.cargarAlumno(this.uidAlumno, this.centroeducativoService.uid)
      .subscribe(res => {
        this.alumno = res['alumnos'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
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

  cargarExamenesResueltos(){
    this.centroeducativoService.cargarExamenesResueltos(this.uidAlumno, this.centroeducativoService.uid)
      .subscribe(res => {
        this.examenesResueltos = res['examenesAlumno']
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }

}
