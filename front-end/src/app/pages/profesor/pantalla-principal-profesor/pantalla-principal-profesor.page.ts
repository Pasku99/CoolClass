import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { ProfesorService } from '../../../services/profesor.service';
import { MisClases } from '../../../models/misclases.model';
import Swal from 'sweetalert2';
import { Examen } from '../../../models/examen.model';

@Component({
  selector: 'app-pantalla-principal-profesor',
  templateUrl: './pantalla-principal-profesor.page.html',
  styleUrls: ['./pantalla-principal-profesor.page.scss'],
})
export class PantallaPrincipalProfesorPage implements OnInit {
  // @ViewChild(IonSlides) slides: IonSlides;

  @ViewChildren(IonSlides) slides: QueryList<IonSlides>;
  public listaClasesProfesor: Array<string> = new Array<string>();
  public listaClasesProfesorObjeto: MisClases[] = [];
  public filtro: string = '';
  public ultimosExamenes: Examen[] = [];
  public proximosExamenes: Examen[] = [];
  public fechas: Array<string> = new Array<string>();
  public horas: Array<string> = new Array<string>();

  constructor(private authService: AuthService,
              private profesorService: ProfesorService) { }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnInit() {  }

  async ionViewWillEnter(){
    await this.authService.cogerToken();
    await this.sleep(250);
    this.cargarClases();
    this.cargarUltimosExamenes();
    this.cargarProximosExamenes();
    // Esperamos a que se vuelva a iniciar el recorrido automático de los slides
    await this.startSlides();
  }

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
    this.slideWithNav3.slideTo(0);
    this.slideWithNav.stopAutoplay();
    this.slideWithNav2.stopAutoplay();
    this.slideWithNav3.stopAutoplay();
  }

  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  @ViewChild('slideWithNav2', { static: false }) slideWithNav2: IonSlides;
  @ViewChild('slideWithNav3', { static: false }) slideWithNav3: IonSlides;

  sliderOne: any;
  sliderTwo: any;
  sliderThree: any;

  //Configuracion de los sliders
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

  cargarClases(){
    this.profesorService.cargarClasesProfesor(this.profesorService.uidCentro, this.profesorService.uid, this.filtro)
      .subscribe(res =>{
        this.listaClasesProfesor = res['infoClases'];
        this.listaClasesProfesorObjeto = [];
        for(let i = 0; i < this.listaClasesProfesor.length; i++){
          let clases = {nombre: this.listaClasesProfesor[i][0], asignatura: this.listaClasesProfesor[i][1], uidClase: this.listaClasesProfesor[i][2], expanded: false};
          this.listaClasesProfesorObjeto.push(clases);
        }
      }, (err) =>{
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      });
  }

  cargarUltimosExamenes(){
    this.profesorService.cargarUltimosExamenes(this.profesorService.uid)
      .subscribe(res => {
        this.ultimosExamenes = res['ultimosExamenes'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarProximosExamenes(){
    this.profesorService.cargarProximosExamenes(this.profesorService.uid)
      .subscribe(res => {
        this.proximosExamenes = res['proximosExamenes'];
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
      }));
  }

}
