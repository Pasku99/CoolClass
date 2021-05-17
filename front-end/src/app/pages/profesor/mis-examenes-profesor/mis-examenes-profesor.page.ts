import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../services/profesor.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Examen } from 'src/app/models/examen.model';
import { Clase } from '../../../models/clase.model';

@Component({
  selector: 'app-mis-examenes-profesor',
  templateUrl: './mis-examenes-profesor.page.html',
  styleUrls: ['./mis-examenes-profesor.page.scss'],
})
export class MisExamenesProfesorPage implements OnInit {

  public items: any = [];
  public uidClase: string = '';
  public examenesClase: Examen[] = [];
  public asignatura: string = '';
  public nombreClase: string = '';
  public nombreExamen: string = '';
  public proximosExamenes: Examen[] = [];
  public clase: Clase = new Clase('');
  public listaDesplegable: Examen[] = [];
  public filtro: string = '';
  public fechas: Array<string> = new Array<string>();
  public horas: Array<string> = new Array<string>();

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
      this.proximosExamenes.map(listItem => {
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
    this.nombreExamen = this.route.snapshot.params['nombreExamen'];
    this.cargarClase();
    this.cargarDesplegable();
    if(this.nombreExamen){
      this.cargarProximosExamenesFiltro(this.nombreExamen);
    } else {
      this.cargarProximosExamenes();
    }
  }

  cargarProximosExamenes(){
    this.profesorService.cargarProximosExamenes(this.profesorService.uid, this.uidClase)
      .subscribe(res => {
        this.proximosExamenes = res['proximosExamenes'];
        this.fechas = [];
        this.horas = [];
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

  cargarProximosExamenesFiltro(filtro){
    this.profesorService.cargarProximosExamenes(this.profesorService.uid, this.uidClase, filtro)
      .subscribe(res => {
        this.proximosExamenes = res['proximosExamenes'];
        this.fechas = [];
        this.horas = [];
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

  filtrarNombre($event){
    this.filtro = $event.target.value;
    if(this.filtro == 'Todos'){
      this.filtro = '';
      this.cargarProximosExamenes();
    } else {
      this.cargarProximosExamenesFiltro(this.filtro);
    }
  }

  cargarDesplegable(){
    this.profesorService.cargarProximosExamenes(this.profesorService.uid, this.uidClase)
      .subscribe(res =>{
        this.listaDesplegable = res['proximosExamenes'];
      }, (err) =>{
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      });
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
            this.cargarProximosExamenes();
            this.cargarDesplegable();
          }, (err => {
            const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
            Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
            return;
          }))
      }
    });
  }

}
