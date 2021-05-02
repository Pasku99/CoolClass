import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../services/profesor.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Examen } from 'src/app/models/examen.model';

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
      this.examenesClase.map(listItem => {
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
    this.cargarExamenesProfesor();
  }

  cargarExamenesProfesor(){
    this.profesorService.cargarExamenesClaseProfesor(this.profesorService.uid, this.uidClase)
      .subscribe(res => {
        this.examenesClase = res['examenesProfesor'];
        this.asignatura = this.examenesClase[0].asignatura;
        this.nombreClase = this.examenesClase[0].nombreClase;
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }));
  }

}
