import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../services/profesor.service';
import { ActivatedRoute } from '@angular/router';
import { Clase } from 'src/app/models/clase.model';
import { Alumno } from 'src/app/models/alumno.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-alumnos-profesor',
  templateUrl: './mis-alumnos-profesor.page.html',
  styleUrls: ['./mis-alumnos-profesor.page.scss'],
})
export class MisAlumnosProfesorPage implements OnInit {

  public items: any = [];
  public uidClase: string = '';
  public alumnos: Alumno[] = [];
  public listaDesplegable: Alumno[] = [];
  public filtro: string = '';
  public clase: Clase;

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
      this.alumnos.map(listItem => {
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
    this.cargarClase();
    this.cargarAlumnosClase(this.profesorService.uidCentro, this.uidClase, this.profesorService.uid);
  }

  cargarAlumnosClase(uidCentro, uidClase, uidProfesor){
    this.profesorService.cargarAlumnosClase(uidCentro, uidClase, uidProfesor)
      .subscribe( res => {
        this.alumnos = res['alumnos'];
        this.listaDesplegable = res['alumnos'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarAlumnosClaseFiltro(uidCentro, uidClase, uidProfesor, nombreProf){
    this.profesorService.cargarAlumnosClase(uidCentro, uidClase, uidProfesor, nombreProf)
      .subscribe( res => {
        this.alumnos = res['alumnos'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  filtrarNombre($event){
    this.filtro = $event.target.value;
    if(this.filtro == 'Todos'){
      this.filtro = '';
      this.cargarAlumnosClase(this.profesorService.uidCentro, this.uidClase, this.profesorService.uid);
    } else {
      this.cargarAlumnosClaseFiltro(this.profesorService.uidCentro, this.uidClase, this.profesorService.uid, this.filtro);
    }
  }

  cargarClase(){
    this.profesorService.cargarClasesUid(this.profesorService.uidCentro, this.profesorService.uid, this.uidClase)
      .subscribe(res => {
        this.clase = res['arrayClases'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

}
