import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../services/profesor.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ExamenResuelto } from '../../../models/examenresuelto.model';
import { Clase } from '../../../models/clase.model';
import { Examen } from '../../../models/examen.model';

@Component({
  selector: 'app-mis-examenes-notas-profesor',
  templateUrl: './mis-examenes-notas-profesor.page.html',
  styleUrls: ['./mis-examenes-notas-profesor.page.scss'],
})
export class MisExamenesNotasProfesorPage implements OnInit {

  public items: any = [];
  public uidClase: string = '';
  public uidExamen: string = '';
  public nombreExamen: string = '';
  public nombreClase: string = '';
  public examen: Examen = new Examen('');
  public examenesAlumno: ExamenResuelto[] = [];
  public clase: Clase = new Clase('');
  public asignatura: string = '';
  public filtro: string = '';
  public listaDesplegable: Array<string> = new Array<string>();
  public fecha: string = '';
  public hora: string = '';

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
      this.examenesAlumno.map(listItem => {
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
    this.uidExamen = this.route.snapshot.params['idExamen'];
    this.asignatura = this.route.snapshot.params['asignatura'];
    this.cargarExamenesResueltos();
    this.cargarClaseProfesor();
    this.cargarExamen();
    this.cargarClase();
  }

  cargarExamenesResueltos(){
    this.profesorService.cargarNotasExamen(this.uidExamen, this.profesorService.uid)
      .subscribe(res => {
        this.examenesAlumno = res['examenesResueltos'];
        this.listaDesplegable = [];
        for(let i = 0; i < this.examenesAlumno.length; i++){
          this.listaDesplegable.push(this.examenesAlumno[i].nombreAlumno);
        }
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }

  cargarExamenesResueltosFiltro(nombreAlumno){
    this.profesorService.cargarNotasExamen(this.uidExamen, this.profesorService.uid, nombreAlumno)
      .subscribe(res => {
        this.examenesAlumno = res['examenesResueltos'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }

  cargarClaseProfesor(){
    this.profesorService.cargarClaseProfesor(this.profesorService.uid, this.uidClase)
      .subscribe(res => {
        this.clase = res['clase'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarExamen(){
    this.fecha = '';
    this.hora = '';
    this.profesorService.cargarExamen(this.uidExamen, this.profesorService.uid)
      .subscribe(res => {
        this.examen = res['examenes'];
        this.nombreExamen = this.examen.nombreExamen;
        let date = new Date(this.examen.fechaComienzo);
        // Ponemos fecha
        this.fecha = (("00" +  date.getDate()).slice(-2) + "/" +
        ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
        date.getFullYear());
        // Ponemos hora
        this.hora = ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2);
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }

  cargarClase(){
    this.profesorService.cargarClasesUid(this.profesorService.uidCentro, this.profesorService.uid, this.uidClase)
      .subscribe(res => {
        this.clase = res['arrayClases'];
        this.nombreClase = this.clase[0].nombre;
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
      this.cargarExamenesResueltos();
    } else {
      this.cargarExamenesResueltosFiltro(this.filtro);
    }
  }

}
