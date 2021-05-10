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
  public fechas: Array<string> = new Array<string>();

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
        this.fechas = [];
        for(let i = 0; i < this.examenes.length; i++){
          let date = new Date(this.examenes[i].fechaComienzo);
          let fecha = '';
          fecha = ("00" +  date.getDate()).slice(-2) + "/" +
          ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
          date.getFullYear() + " " +
          ("00" + date.getHours()).slice(-2) + ":" +
          ("00" + date.getMinutes()).slice(-2) + ":" +
          ("00" + date.getSeconds()).slice(-2);
          this.fechas.push(fecha);
        }
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
    // Fecha actual
    let fechaActual = new Date();
    fechaActual.setHours(fechaActual.getHours() + 2);
    let fechaNow = fechaActual.toISOString();
    // Fecha comienzo examen
    let fechaInicioExamen = new Date(fechaInicio);
    fechaInicioExamen.setHours(fechaInicioExamen.getHours() + 2);
    let fechaInicioExamenString = fechaInicioExamen.toISOString();
    // Fecha final examen
    let fechaFinalExamen = new Date(fechaFinal);
    fechaFinalExamen.setHours(fechaFinalExamen.getHours() + 2);
    let fechaFinalExamenString = fechaFinalExamen.toISOString();


    console.log(fechaNow);
    console.log(fechaInicioExamenString);
    console.log(fechaFinalExamenString);

    if(Date.parse(fechaNow) >= Date.parse(fechaInicioExamenString) && Date.parse(fechaNow) <= Date.parse(fechaFinalExamenString)){
      this.router.navigateByUrl('/tabs-alumno/asignaturas/info-asignatura/examenes/hacer-examen/'+ this.uidProfesor +  '/' + uidExamen);
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
