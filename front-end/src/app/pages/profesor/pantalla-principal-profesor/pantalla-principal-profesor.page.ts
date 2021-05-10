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

  constructor(private authService: AuthService,
              private profesorService: ProfesorService) {
    // this.sliderOne =
    // {
    //   isBeginningSlide: true,
    //   isEndSlide: false,
    //   slidesItems: [
    //     {
    //       id: 995
    //     },
    //     {
    //       id: 925
    //     },
    //     {
    //       id: 940
    //     },
    //     {
    //       id: 943
    //     },
    //     {
    //       id: 944
    //     }
    //   ]
    // };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ionViewWillEnter(){
    await this.authService.cogerToken();
    await this.sleep(15);
    this.cargarClases();
    this.cargarUltimosExamenes();
    this.cargarProximosExamenes();
  }

  ngOnInit() {  }

  //  //Mover al slide siguiente
  //  slideNext(object, slideView) {
  //   slideView.slideNext(500).then(() => {
  //     this.checkIfNavDisabled(object, slideView);
  //   });
  // }

  // //Mover al slide anterior
  // slidePrev(object, slideView) {
  //   slideView.slidePrev(500).then(() => {
  //     this.checkIfNavDisabled(object, slideView);
  //   });;
  // }

  // SlideDidChange(object, slideView) {
  //   // this.checkIfNavDisabled(object, slideView);
  // }

  // checkIfNavDisabled(object, slideView) {
  //   this.checkisBeginning(object, slideView);
  //   this.checkisEnd(object, slideView);
  // }

  // checkisBeginning(object, slideView) {
  //   slideView.isBeginning().then((istrue) => {
  //     object.isBeginningSlide = istrue;
  //   });
  // }

  // checkisEnd(object, slideView) {
  //   slideView.isEnd().then((istrue) => {
  //     object.isEndSlide = istrue;
  //   });
  // }

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
    spaceBetween: 20
  };

  // public moveForward(index: number): void {
  //   this.slides.toArray()[index].slideNext(500);
  //   console.log(this.slides.toArray()[index].isEnd())
  // }

  // public moveBehind(index: number): void {
  //   this.slides.toArray()[index].slidePrev(500);
  // }

  // sleep(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  // async ionViewWillEnter(){
  //   await this.authService.cogerToken();
  //   await this.sleep(15);
  //   this.cargarClases();
  //   this.cargarUltimosExamenes();
  //   this.cargarProximosExamenes();
  // }

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
      }));
  }

}
