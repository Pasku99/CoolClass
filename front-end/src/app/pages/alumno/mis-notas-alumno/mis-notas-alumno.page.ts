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
  public nombreExamen: string = '';
  public filtro: string = '';
  public listaDesplegable: ExamenResuelto[] = [];
  public asignatura: string = '';
  public asignaturaMayus: string = '';

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
    this.nombreExamen = this.route.snapshot.params['nombreExamen'];
    this.asignatura = this.route.snapshot.params['asignatura'];
    this.asignaturaMayus = this.asignatura.toUpperCase();
    this.cargarProfesor();
    this.cargarDesplegable();
    if(this.nombreExamen){
      this.cargarNotasAlumnoFiltro(this.nombreExamen);
    } else {
      this.cargarNotasAlumno();
    }
  }

  cargarNotasAlumno(){
    this.alumnoService.cargarNotasAsignaturaAlumno(this.uidProfesor, this.alumnoService.uid)
      .subscribe(res => {
        this.examenesResueltos = res['examenesResueltos'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarDesplegable(){
    this.alumnoService.cargarNotasAsignaturaAlumno(this.uidProfesor, this.alumnoService.uid)
      .subscribe(res => {
        this.listaDesplegable = res['examenesResueltos'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarNotasAlumnoFiltro(filtro){
    this.alumnoService.cargarNotasAsignaturaAlumno(this.uidProfesor, this.alumnoService.uid, '', filtro)
    .subscribe(res => {
      this.examenesResueltos = res['examenesResueltos'];
    }, (err => {
      const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
      return;
    }));
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

  filtrarNombre($event){
    this.filtro = $event.target.value;
    if(this.filtro == 'Todos'){
      this.filtro = '';
      this.cargarNotasAlumno();
    } else {
      this.cargarNotasAlumnoFiltro(this.filtro);
    }
  }

}
