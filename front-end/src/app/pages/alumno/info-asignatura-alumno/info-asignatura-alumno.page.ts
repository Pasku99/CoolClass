import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { AlumnoService } from '../../../services/alumno.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-info-asignatura-alumno',
  templateUrl: './info-asignatura-alumno.page.html',
  styleUrls: ['./info-asignatura-alumno.page.scss'],
})
export class InfoAsignaturaAlumnoPage implements OnInit {

  @ViewChildren(IonSlides) slides: QueryList<IonSlides>;
  public asignaturaMayus: string = '';
  public filtroAsignatura: string = '';
  public listaAsignaturas : Array<String> = new Array<String>();
  public listaAsignaturasMayus : Array<String> = new Array<String>();
  public uidProfesor: string = '';
  public nombreProfesor: string = '';

  constructor(private route: ActivatedRoute,
              private alumnoService: AlumnoService) {}

  public moveForward(index: number): void {
    this.slides.toArray()[index].slideNext(500);
  }

  public moveBehind(index: number): void {
    this.slides.toArray()[index].slidePrev(500);
  }

  ngOnInit() { }

  ionViewWillEnter(){
    this.filtroAsignatura = this.route.snapshot.params['asignatura'];
    this.asignaturaMayus = this.filtroAsignatura.toUpperCase();
    this.cargarAsignaturas();
  }

  cargarAsignaturas(){
    this.alumnoService.cargarAsignaturasAlumno(this.alumnoService.uid, this.alumnoService.uidClase, this.filtroAsignatura)
      .subscribe(res => {
        this.uidProfesor = res['profesores'][0];
        this.alumnoService.cargarProfesor(this.alumnoService.uid, this.uidProfesor)
          .subscribe(res => {
            this.nombreProfesor = res['profesor'].nombre;
          })
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

}
