import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Examen } from '../../../models/examen.model';
import { ProfesorService } from '../../../services/profesor.service';
import { ActivatedRoute } from '@angular/router';
import { Clase } from '../../../models/clase.model';

@Component({
  selector: 'app-examenes-realizados',
  templateUrl: './examenes-realizados.page.html',
  styleUrls: ['./examenes-realizados.page.scss'],
})
export class ExamenesRealizadosPage implements OnInit {

  public items: any = [];
  public uidClase: string = '';
  public examenesClase: Examen[] = [];
  public asignatura: string = '';
  public nombreClase: string = '';
  public ultimosExamenes: Examen[] = [];
  public clase: Clase = new Clase('');
  public filtro: string = '';
  public listaDesplegable: Examen[] = [];

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
      this.ultimosExamenes.map(listItem => {
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
    this.asignatura = this.route.snapshot.params['asignatura'];
    this.listaDesplegable = [];
    this.cargarExamenesRealizados();
    this.cargarClase();
  }

  cargarExamenesRealizados(){
    this.profesorService.cargarUltimosExamenes(this.profesorService.uid, this.uidClase)
      .subscribe(res => {
        this.ultimosExamenes = res['ultimosExamenes'];
        this.listaDesplegable = res['ultimosExamenes'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

  cargarExamenesRealizadosFiltro(filtro){
    this.profesorService.cargarUltimosExamenes(this.profesorService.uid, this.uidClase, filtro)
      .subscribe(res => {
        this.ultimosExamenes = res['ultimosExamenes'];
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
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
      this.cargarExamenesRealizados();
    } else {
      this.cargarExamenesRealizadosFiltro(this.filtro);
    }
  }

  eliminarExamen(uidExamen){
    Swal.fire({
      title: '¿Está seguro/a?',
      text: 'Se borrarán todos los datos asociados al examen, así como las notas de los alumnos.',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#004dff',
      allowOutsideClick: false,
      heightAuto: false,
    }).then((result) => {
      if (result.value) {
        this.profesorService.eliminarExamen(this.profesorService.uid, uidExamen)
          .subscribe(res => {
            Swal.fire({
              title: 'Examen eliminado con éxito',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Vale',
              confirmButtonColor: '#004dff',
              allowOutsideClick: false,
              heightAuto: false,
            });
            this.cargarExamenesRealizados();
          }, (err => {
            const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
            Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
            return;
          }))
      }
    });
  }

}
