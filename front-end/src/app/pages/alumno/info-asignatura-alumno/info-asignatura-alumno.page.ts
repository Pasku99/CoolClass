import { Component, OnInit, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSlides, LoadingController } from '@ionic/angular';
import { AlumnoService } from '../../../services/alumno.service';
import Swal from 'sweetalert2';
import { ExamenResuelto } from '../../../models/examenresuelto.model';
import { Examen } from '../../../models/examen.model';

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
  public examenesResueltos: ExamenResuelto[] = [];
  public examenes: Examen[] = [];
  public fechas: Array<string> = new Array<string>();
  public horas: Array<string> = new Array<string>();

  constructor(private route: ActivatedRoute,
              private alumnoService: AlumnoService,
              private loadingController: LoadingController) {}

  public moveForward(index: number): void {
    this.slides.toArray()[index].slideNext(500);
  }

  public moveBehind(index: number): void {
    this.slides.toArray()[index].slidePrev(500);
  }

  ngOnInit() { }

  async ionViewWillEnter(){
    // this.presentLoading();
    this.filtroAsignatura = this.route.snapshot.params['asignatura'];
    this.asignaturaMayus = this.filtroAsignatura.toUpperCase();
    this.cargarAsignaturas();
    await this.startSlides();
  }

  // async presentLoading() {
  //   const loading = await this.loadingController.create({
  //     cssClass: 'my-custom-class',
  //     message: 'Por favor, espere...',
  //     duration: 1000,
  //   });
  //   await loading.present();

  //   const { role, data } = await loading.onDidDismiss();
  // }

  async startSlides(){
    this.slideWithNav.slideTo(0);
    this.slideWithNav2.slideTo(0);
    this.slideWithNav.startAutoplay();
    this.slideWithNav2.startAutoplay();
  }

  async ionViewWillLeave(){
    await this.stopSlides();
  }

  async stopSlides(){
    this.slideWithNav.slideTo(0);
    this.slideWithNav2.slideTo(0);
    this.slideWithNav.stopAutoplay();
    this.slideWithNav2.stopAutoplay();
  }

  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  @ViewChild('slideWithNav2', { static: false }) slideWithNav2: IonSlides;

  sliderOne: any;
  sliderTwo: any;
  sliderThree: any;

  //Configuration for each Slider
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 2,
    autoplay: {
      disableOnInteraction: false,
      loop :true,
    },
    centeredSlides: true,
    spaceBetween: 100
  };
  slideOptsTwo = {
    initialSlide: 0,
    slidesPerView: 2,
    autoplay: {
      disableOnInteraction: false,
      loop :true,
    },
    centeredSlides: true,
    spaceBetween: 125
  };

  cargarAsignaturas(){
    this.alumnoService.cargarAsignaturasAlumno(this.alumnoService.uid, this.alumnoService.uidClase, this.filtroAsignatura)
      .subscribe(res => {
        this.uidProfesor = res['profesores'][0];
        this.cargarNotasAlumno();
        this.cargarProximosExamenesAlumno();
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

  cargarNotasAlumno(){
    this.alumnoService.cargarNotasAsignaturaAlumno(this.uidProfesor, this.alumnoService.uid, 'limitado')
      .subscribe(res => {
        this.examenesResueltos = res['examenesResueltos'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }

  cargarProximosExamenesAlumno(){
    this.alumnoService.cargarProximosExamenesAlumno(this.alumnoService.uid, this.uidProfesor, this.alumnoService.uidClase)
      .subscribe(res => {
        this.examenes = res['proximosExamenes'];
        this.fechas = [];
        this.horas = [];
        for(let i = 0; i < this.examenes.length; i++){
          let date = new Date(this.examenes[i].fechaComienzo);
            let fecha = '';
            let hora = '';
            // Ponemos fecha
            fecha = (("00" +  date.getDate()).slice(-2) + "/" +
            ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
            date.getFullYear());
            this.fechas.push(fecha);
            // Ponemos hora
            hora = ("00" + date.getHours()).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2);
            this.horas.push(hora);
        }
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

}
