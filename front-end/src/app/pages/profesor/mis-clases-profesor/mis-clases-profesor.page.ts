import { Component, OnInit } from '@angular/core';
import { Asignatura } from 'src/app/models/asignatura.model';
import { MisClases } from 'src/app/models/misclases.model';
import { ProfesorService } from '../../../services/profesor.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mis-clases-profesor',
  templateUrl: './mis-clases-profesor.page.html',
  styleUrls: ['./mis-clases-profesor.page.scss'],
})
export class MisClasesProfesorPage implements OnInit {

  public items: any = [];
  public filtro: string = '';
  // public listaClasesProfesor: MisClases[] = [];
  public listaClasesProfesor:Array<string> = new Array<string>();
  public listaClasesProfesorObjeto:MisClases[] = [];
  public listaDesplegable: MisClases[] = [];
  public listaAsignaturasEnUso: Array<string> = new Array<string>();
  public listaAsignaturasEnUsoProf: Asignatura[] = [];
  public uidClases: Array<string> = new Array<string>();
  public nombreClase: string = '';

  constructor(private profesorService: ProfesorService,
              private route: ActivatedRoute) {
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
      this.listaClasesProfesorObjeto.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }

  ngOnInit() { }

  ionViewWillEnter(){
    this.nombreClase = this.route.snapshot.params['nombreClase'];
    if(this.nombreClase){
      this.cargarDesplegable(this.profesorService.uidCentro, this.profesorService.uid, this.filtro);
      this.cargarClasesFiltro(this.profesorService.uidCentro, this.profesorService.uid, this.nombreClase);
    } else {
      this.cargarClases(this.profesorService.uidCentro, this.profesorService.uid, this.filtro);
    }
  }

  cargarClases(uidCentro, uidProfesor, filtro){
    this.profesorService.cargarClasesProfesor(uidCentro, uidProfesor, filtro)
      .subscribe(res =>{
        this.listaClasesProfesor = res['infoClases'];
        this.listaClasesProfesorObjeto = [];
        this.listaDesplegable = [];

        for(let i = 0; i < this.listaClasesProfesor.length; i++){
          let clases = {nombre: this.listaClasesProfesor[i][0], asignatura: this.listaClasesProfesor[i][1], uidClase: this.listaClasesProfesor[i][2], expanded: false};
          this.listaClasesProfesorObjeto.push(clases);
        }

        for(let i = 0; i < this.listaClasesProfesor.length; i++){
          let clases = {nombre: this.listaClasesProfesor[i][0], asignatura: this.listaClasesProfesor[i][1], uidClase: this.listaClasesProfesor[i][2], expanded: false};
          this.listaDesplegable.push(clases);
        }
      }, (err) =>{
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      });
  }

  cargarClasesFiltro(uidCentro, uidProfesor, filtro){
    this.profesorService.cargarClasesProfesor(uidCentro, uidProfesor, filtro)
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

  cargarDesplegable(uidCentro, uidProfesor, filtro){
    this.profesorService.cargarClasesProfesor(uidCentro, uidProfesor, filtro)
      .subscribe(res =>{
        this.listaClasesProfesor = res['infoClases'];
        this.listaDesplegable = [];
        for(let i = 0; i < this.listaClasesProfesor.length; i++){
          let clases = {nombre: this.listaClasesProfesor[i][0], asignatura: this.listaClasesProfesor[i][1], uidClase: this.listaClasesProfesor[i][2], expanded: false};
          this.listaDesplegable.push(clases);
        }
      }, (err) =>{
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      });
  }


  filtrarNombre($event){
    this.filtro = $event.target.value;
    if(this.filtro == 'Todas'){
      this.filtro = '';
      this.cargarClases(this.profesorService.uidCentro, this.profesorService.uid, this.filtro);
    } else {
      this.cargarClasesFiltro(this.profesorService.uidCentro, this.profesorService.uid, this.filtro);
    }
  }

}
