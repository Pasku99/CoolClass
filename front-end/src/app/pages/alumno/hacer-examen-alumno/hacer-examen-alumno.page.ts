import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Examen } from '../../../models/examen.model';
import { AlumnoService } from '../../../services/alumno.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hacer-examen-alumno',
  templateUrl: './hacer-examen-alumno.page.html',
  styleUrls: ['./hacer-examen-alumno.page.scss'],
})
export class HacerExamenAlumnoPage implements OnInit {

  public uidExamen: string = '';
  public examen: Examen = new Examen('');
  public arrayPreguntas: Array<any> = new Array<any>();
  public arrayRespuestas: Array<any> = new Array<any>();

  constructor(private alumnoService: AlumnoService,
              private route: ActivatedRoute) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.uidExamen = this.route.snapshot.params['idExamen'];
    this.cargarExamen();
  }

  mensajeConfirmacion(){
    Swal.fire({
      title: '¿Estás seguro/a?',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: '#004dff',
      cancelButtonText: 'No',
      cancelButtonColor: 'red',
      allowOutsideClick: false,
      heightAuto: false,
    }).then((result) => {
      if (result.value) {

      }
    });
  }

  cargarExamen(){
    this.alumnoService.cargarExamenAlumno(this.uidExamen, this.alumnoService.uid, this.alumnoService.uidCentro)
      .subscribe(res => {
        this.examen = res['examen'];
        this.arrayPreguntas = this.examen.preguntas;
        this.arrayRespuestas = this.examen.respuestas;
        console.log(this.arrayPreguntas);
        console.log(this.arrayRespuestas);
      }, (err => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext, heightAuto: false});
        return;
      }))
  }

}
