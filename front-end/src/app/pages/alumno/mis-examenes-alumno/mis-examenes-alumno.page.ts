import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { AlumnoService } from '../../../services/alumno.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Examen } from '../../../models/examen.model';

@Component({
  selector: 'app-mis-examenes-alumno',
  templateUrl: './mis-examenes-alumno.page.html',
  styleUrls: ['./mis-examenes-alumno.page.scss'],
})
export class MisExamenesAlumnoPage implements OnInit {

  public items: any = [];
  public uidProfesor: string = '';
  public examenes: Examen[] = [];
  public nombreProfesor: string = '';

  constructor(private alumnoService: AlumnoService,
              private route: ActivatedRoute,
              private router: Router) {
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
      this.examenes.map(listItem => {
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
    this.cargarProximosExamenesAlumno();
    this.cargarProfesor();
  }

  cargarProximosExamenesAlumno(){
    this.alumnoService.cargarProximosExamenesAlumno(this.alumnoService.uid, this.uidProfesor, this.alumnoService.uidClase)
      .subscribe(res => {
        this.examenes = res['proximosExamenes'];
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

  hacerExamen(fechaInicio, fechaFinal, uidExamen){
    let fechaActual = new Date();
    // let fechaActual = new Date();
    fechaActual.setHours(fechaActual.getHours() +2);
    let fechaNow = fechaActual.toISOString();
    console.log(fechaNow);
    console.log(fechaInicio);
    if(Date.parse(fechaNow) >= Date.parse(fechaInicio) && Date.parse(fechaNow) <= Date.parse(fechaFinal)){
      this.router.navigateByUrl('/tabs-alumno/asignaturas/info-asignatura/examenes/hacer-examen/' + uidExamen);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'No...',
        text: 'Todavía no puedes realizar este examen',
        heightAuto: false});
      return;
    }
  }

}
