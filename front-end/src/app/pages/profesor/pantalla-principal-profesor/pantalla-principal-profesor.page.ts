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

  constructor(private authService: AuthService,
              private profesorService: ProfesorService) {}

  public moveForward(index: number): void {
    this.slides.toArray()[index].slideNext(500);
  }

  public moveBehind(index: number): void {
    this.slides.toArray()[index].slidePrev(500);
  }

  ngOnInit() { }

  ionViewWillEnter(){
    this.authService.cogerToken();
    this.cargarClases();
    this.cargarUltimosExamenes();
    this.cargarProximosExamenes();
  }

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
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

}
