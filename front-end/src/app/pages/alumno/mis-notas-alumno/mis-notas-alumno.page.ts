import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../../services/alumno.service';
import Swal from 'sweetalert2';
import { ExamenResuelto } from '../../../models/examenresuelto.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mis-notas-alumno',
  templateUrl: './mis-notas-alumno.page.html',
  styleUrls: ['./mis-notas-alumno.page.scss'],
})
export class MisNotasAlumnoPage implements OnInit {

  public items: any = [];
  public uidProfesor: string = '';
  public examenesResueltos: ExamenResuelto[] = [];
  public nombreProfesor: string = '';

  constructor(private alumnoService: AlumnoService,
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

  ionViewWillEnter(){
    this.uidProfesor = this.route.snapshot.params['idProfesor'];
    this.cargarNotasAlumno();
    this.cargarProfesor();
  }

  cargarNotasAlumno(){
    this.alumnoService.cargarNotasAsignaturaAlumno(this.uidProfesor, this.alumnoService.uid)
      .subscribe(res => {
        this.examenesResueltos = res['examenesAlumno'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }

  cargarProfesor(){
    this.alumnoService.cargarProfesor(this.alumnoService.uid, this.uidProfesor)
      .subscribe(res => {
        this.nombreProfesor = res['profesor'].nombre;
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

}
