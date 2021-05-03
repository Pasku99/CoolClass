import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../services/profesor.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ExamenResuelto } from '../../../models/examenresuelto.model';
import { Clase } from '../../../models/clase.model';
import { Examen } from '../../../models/examen.model';

@Component({
  selector: 'app-mis-examenes-notas-profesor',
  templateUrl: './mis-examenes-notas-profesor.page.html',
  styleUrls: ['./mis-examenes-notas-profesor.page.scss'],
})
export class MisExamenesNotasProfesorPage implements OnInit {

  public items: any = [];
  public uidClase: string = '';
  public uidExamen: string = '';
  public nombreExamen: string = '';
  public nombreClase: string = '';
  public examen: Examen = new Examen('');
  public examenesAlumno: ExamenResuelto[] = [];
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
      this.examenesAlumno.map(listItem => {
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
    this.uidExamen = this.route.snapshot.params['idExamen'];
    this.cargarExamenesResueltos();
    this.cargarClaseProfesor();
    this.cargarExamen();
  }

  cargarExamenesResueltos(){
    this.profesorService.cargarNotasExamen(this.uidExamen, this.profesorService.uid)
      .subscribe(res => {
        this.examenesAlumno = res['examenesResueltos'];
        // this.nombreExamen = this.examenesAlumno[0].nombreExamen;
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }

  cargarClaseProfesor(){
    this.profesorService.cargarClaseProfesor(this.profesorService.uid, this.uidClase)
      .subscribe(res => {
        this.clase = res['clase'];
        // this.nombreClase = this.clase.nombre;
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarExamen(){
    this.profesorService.cargarExamen(this.uidExamen, this.profesorService.uid)
      .subscribe(res => {
        this.examen = res['examenes'];
        this.nombreExamen = this.examen.nombreExamen;
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }

}
