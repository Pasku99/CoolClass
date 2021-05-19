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
  public fechasComienzo: Array<string> = new Array<string>();
  public fechasFinal: Array<string> = new Array<string>();
  public nombreExamen: string = '';
  public filtro: string = '';
  public listaDesplegable: Examen[] = [];
  public asignatura: string = '';
  public asignaturaMayus: string = '';

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
    this.nombreExamen = this.route.snapshot.params['nombreExamen'];
    this.asignatura = this.route.snapshot.params['asignatura'];
    this.asignaturaMayus = this.asignatura.toUpperCase();
    this.cargarDesplegable();
    this.cargarProfesor();
    if(this.nombreExamen){
      this.cargarProximosExamenesAlumnoFiltro(this.nombreExamen);
    } else {
      this.cargarProximosExamenesAlumno();
    }
  }

  cargarProximosExamenesAlumno(){
    this.alumnoService.cargarProximosExamenesAlumno(this.alumnoService.uid, this.uidProfesor, this.alumnoService.uidClase)
      .subscribe(res => {
        this.examenes = res['proximosExamenes'];
        this.fechasComienzo = [];
        this.fechasFinal = [];
        for(let i = 0; i < this.examenes.length; i++){
          // Fecha comienzo
          let dateComienzo = new Date(this.examenes[i].fechaComienzo);
          let fechaComienzo = '';
          fechaComienzo = ("00" +  dateComienzo.getDate()).slice(-2) + "/" +
          ("00" + (dateComienzo.getMonth() + 1)).slice(-2) + "/" +
          dateComienzo.getFullYear() + " " +
          ("00" + dateComienzo.getHours()).slice(-2) + ":" +
          ("00" + dateComienzo.getMinutes()).slice(-2);
          this.fechasComienzo.push(fechaComienzo);

          // Fecha finalizacion
          let dateFinal = new Date(this.examenes[i].fechaFinal);
          let fechaFinal = '';
          fechaFinal = ("00" +  dateFinal.getDate()).slice(-2) + "/" +
          ("00" + (dateFinal.getMonth() + 1)).slice(-2) + "/" +
          dateFinal.getFullYear() + " " +
          ("00" + dateFinal.getHours()).slice(-2) + ":" +
          ("00" + dateFinal.getMinutes()).slice(-2);
          this.fechasFinal.push(fechaFinal);
        }
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarDesplegable(){
    this.alumnoService.cargarProximosExamenesAlumno(this.alumnoService.uid, this.uidProfesor, this.alumnoService.uidClase)
      .subscribe(res => {
        this.listaDesplegable = res['proximosExamenes'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarProximosExamenesAlumnoFiltro(filtro){
    this.alumnoService.cargarProximosExamenesAlumno(this.alumnoService.uid, this.uidProfesor, this.alumnoService.uidClase, '', filtro)
      .subscribe(res => {
        this.examenes = res['proximosExamenes'];
        this.fechasComienzo = [];
        this.fechasFinal = [];
        for(let i = 0; i < this.examenes.length; i++){

          // Fecha comienzo
          let dateComienzo = new Date(this.examenes[i].fechaComienzo);
          let fechaComienzo = '';
          fechaComienzo = ("00" +  dateComienzo.getDate()).slice(-2) + "/" +
          ("00" + (dateComienzo.getMonth() + 1)).slice(-2) + "/" +
          dateComienzo.getFullYear() + " " +
          ("00" + dateComienzo.getHours()).slice(-2) + ":" +
          ("00" + dateComienzo.getMinutes()).slice(-2);
          this.fechasComienzo.push(fechaComienzo);

          // Fecha finalizacion
          let dateFinal = new Date(this.examenes[i].fechaFinal);
          let fechaFinal = '';
          fechaFinal = ("00" +  dateFinal.getDate()).slice(-2) + "/" +
          ("00" + (dateFinal.getMonth() + 1)).slice(-2) + "/" +
          dateFinal.getFullYear() + " " +
          ("00" + dateFinal.getHours()).slice(-2) + ":" +
          ("00" + dateFinal.getMinutes()).slice(-2);
          this.fechasFinal.push(fechaFinal);
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

    if(Date.parse(fechaNow) >= Date.parse(fechaInicioExamenString) && Date.parse(fechaNow) <= Date.parse(fechaFinalExamenString)){
      this.router.navigateByUrl('/examen/asignaturas/info-asignatura/examenes/hacer-examen/'+ this.uidProfesor +  '/' + uidExamen);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'No...',
        text: 'Todavía no puedes realizar este examen',
        heightAuto: false});
      return;
    }
  }

  filtrarNombre($event){
    this.filtro = $event.target.value;
    if(this.filtro == 'Todos'){
      this.filtro = '';
      this.cargarProximosExamenesAlumno();
    } else {
      this.cargarProximosExamenesAlumnoFiltro(this.filtro);
    }
  }

}
