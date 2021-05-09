import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { AlumnoService } from '../../../services/alumno.service';
import Swal from 'sweetalert2';
import { ExamenResuelto } from '../../../models/examenresuelto.model';
import { Examen } from '../../../models/examen.model';

@Component({
  selector: 'app-pantalla-principal-alumno',
  templateUrl: './pantalla-principal-alumno.page.html',
  styleUrls: ['./pantalla-principal-alumno.page.scss'],
})
export class PantallaPrincipalAlumnoPage implements OnInit {

  @ViewChildren(IonSlides) slides: QueryList<IonSlides>;
  public listaAsignaturas : Array<String> = new Array<String>();
  public listaAsignaturasMayus : Array<String> = new Array<String>();
  public examenesResueltos: ExamenResuelto[] = [];
  public proximosExamenes: Examen[] = [];
  public fechas: Array<string> = new Array<string>();

  constructor(private authService: AuthService,
              private alumnoService: AlumnoService) {}

  public moveForward(index: number): void {
    this.slides.toArray()[index].slideNext(500);
  }

  public moveBehind(index: number): void {
    this.slides.toArray()[index].slidePrev(500);
  }

  ngOnInit() {  }

  ionViewWillEnter(){
    this.authService.cogerToken();
    this.cargarAsignaturas();
    this.cargarUltimosExamenesAlumno();
    this.cargarProximosExamenesAlumno();
  }

  cargarAsignaturas(){
    this.alumnoService.cargarAsignaturasAlumno(this.alumnoService.uid, this.alumnoService.uidClase)
      .subscribe(res => {
        this.listaAsignaturas = res['asignaturas'];
        this.listaAsignaturasMayus = [];
        for(let i = 0; i < this.listaAsignaturas.length; i++){
          this.listaAsignaturasMayus.push(this.listaAsignaturas[i].toUpperCase());
        }
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarUltimosExamenesAlumno(){
    this.alumnoService.cargarUltimosExamenesAlumno(this.alumnoService.uid, 'limitado')
      .subscribe(res => {
        this.examenesResueltos = res['examenesAlumno'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }

  cargarProximosExamenesAlumno(){
    this.alumnoService.cargarTodosProximosExamenesAlumno(this.alumnoService.uid, this.alumnoService.uidClase, 'limitado')
      .subscribe(res => {
        this.proximosExamenes = res['proximosExamenesAlumno'];
        this.fechas = [];
        for(let i = 0; i < this.proximosExamenes.length; i++){
          let date = new Date(this.proximosExamenes[i].fechaComienzo);
          let fecha = '';
          fecha = ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
          ("00" + date.getDate()).slice(-2) + "/" +
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
      }))
  }

}
