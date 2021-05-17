import { Component, OnInit, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { IonSlides, LoadingController } from '@ionic/angular';
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
  public horas: Array<string> = new Array<string>();
  public cargado: boolean = false;

  constructor(private authService: AuthService,
              private alumnoService: AlumnoService,
              private loadingController: LoadingController) { }

  public moveForward(index: number): void {
    this.slides.toArray()[index].slideNext(500);
  }

  public moveBehind(index: number): void {
    this.slides.toArray()[index].slidePrev(500);
  }

  ngOnInit() {  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ionViewWillEnter(){
    await this.authService.cogerToken();
    await this.sleep(500);
    this.cargarAsignaturas();
    this.cargarUltimosExamenesAlumno();
    this.cargarProximosExamenesAlumno();
    await this.startSlides();
  }

  // async cargada(){
  //   await this.storage.get('app_charged').then((result) =>
  //   {
  //     if(result){
  //       this.cargado = true;
  //     }
  //     else {
  //       this.cargado = false;
  //     }
  //   });
  // }

  // async presentLoading() {
  //   const loading = await this.loadingController.create({
  //     cssClass: 'my-custom-class',
  //     message: 'Por favor, espere...',
  //     duration: 1500,
  //   });
  //   await loading.present();

  //   const { role, data } = await loading.onDidDismiss();
  // }

  async startSlides(){
    this.slideWithNav.slideTo(0);
    this.slideWithNav2.slideTo(0);
    this.slideWithNav3.slideTo(0);
    this.slideWithNav.startAutoplay();
    this.slideWithNav2.startAutoplay();
    this.slideWithNav3.startAutoplay();
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
  @ViewChild('slideWithNav3', { static: false }) slideWithNav3: IonSlides;

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
    spaceBetween: 20
  };
  slideOptsThree = {
    initialSlide: 0,
    slidesPerView: 2,
    autoplay: {
      disableOnInteraction: false,
      loop :true,
    },
    centeredSlides: true,
    spaceBetween: 120
  };

  cargarAsignaturas(){
    if(this.alumnoService.uidClase){
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
    } else {
      this.listaAsignaturasMayus = [];
    }
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
    if(this.alumnoService.uidClase){
      this.alumnoService.cargarTodosProximosExamenesAlumno(this.alumnoService.uid, this.alumnoService.uidClase, 'limitado')
        .subscribe(res => {
          this.proximosExamenes = res['proximosExamenesAlumno'];
          this.fechas = [];
          for(let i = 0; i < this.proximosExamenes.length; i++){
            let date = new Date(this.proximosExamenes[i].fechaComienzo);
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
        }))
    } else {
      this.proximosExamenes = [];
    }
  }

}
