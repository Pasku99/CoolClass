import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfesorService } from '../../../services/profesor.service';
import { Clase } from '../../../models/clase.model';
import Swal from 'sweetalert2';
import { ExamenResuelto } from '../../../models/examenresuelto.model';
import { Alumno } from '../../../models/alumno.model';

@Component({
  selector: 'app-notas-alumnos-profesor',
  templateUrl: './notas-alumnos-profesor.page.html',
  styleUrls: ['./notas-alumnos-profesor.page.scss'],
})
export class NotasAlumnosProfesorPage implements OnInit {

  public items: any = [];
  public uidClase: string = '';
  public uidAlumno: string = '';
  public clase: Clase = new Clase('');
  public nombreClase: string = '';
  public nombreAlumno: string = '';
  public examenesResueltos: ExamenResuelto[] = [];
  public alumno: Alumno[] = [];

  constructor(private route: ActivatedRoute,
              private profesorService: ProfesorService) {
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
    this.uidClase = this.route.snapshot.params['idClase'];
    this.uidAlumno = this.route.snapshot.params['idAlumno'];
    this.cargarClaseProfesor();
    this.cargarAlumno();
    this.cargarExamenesResueltosAlumno();
  }

  cargarClaseProfesor(){
    this.profesorService.cargarClaseProfesor(this.profesorService.uid, this.uidClase)
      .subscribe(res => {
        this.clase = res['clase'];
        this.nombreClase = this.clase.nombre;
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarExamenesResueltosAlumno(){
    this.profesorService.cargarExamenesResueltosAlumno(this.profesorService.uid, this.uidAlumno)
      .subscribe(res => {
        this.examenesResueltos = res['examenesResueltos'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }

  cargarAlumno(){
    this.profesorService.cargarAlumno(this.profesorService.uidCentro, this.uidClase, this.profesorService.uid, '', this.uidAlumno)
      .subscribe( res => {
        this.alumno = res['alumnos'];
        this.nombreAlumno = this.alumno['nombre'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  // cargarAlumno(){
  //   this.profesorService.cargarAlumnosClase(this.profesorService.uidCentro, this.uidClase, this.profesorService.uid, nombreProf)
  //     .subscribe( res => {
  //       this.alumnos = res['alumnos'];
  //     }, (err => {
  //       const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
  //       Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
  //       return;
  //     }));
  // }

}
