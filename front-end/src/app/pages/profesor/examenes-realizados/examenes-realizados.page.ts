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
  public proximosExamenes: Examen[] = [];
  public ultimosExamenes: Examen[] = [];
  public clase: Clase = new Clase('');

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
    this.cargarExamenesRealizados();
    this.cargarClase();
  }

  cargarExamenesRealizados(){
    this.profesorService.cargarUltimosExamenes(this.profesorService.uid, this.uidClase)
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

}
