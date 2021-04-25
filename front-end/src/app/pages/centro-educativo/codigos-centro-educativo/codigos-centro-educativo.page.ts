import { Component, OnInit } from '@angular/core';
import { CentroeducativoService } from '../../../services/centroeducativo.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-codigos-centro-educativo',
  templateUrl: './codigos-centro-educativo.page.html',
  styleUrls: ['./codigos-centro-educativo.page.scss'],
})
export class CodigosCentroEducativoPage implements OnInit {

  private codigoProf : string = '';

  constructor(public centroeducativoService: CentroeducativoService,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    this.cargarCodigoProfesor(this.centroeducativoService.codigoProfesor);
    this.cargarCodigoAlumno(this.centroeducativoService.codigoAlumno);
  }

  generarCodigoProfesor(){
    const data = {
      uid : this.centroeducativoService.uid,
    };
    this.centroeducativoService.generarCodigoProfesor(data)
      .subscribe ( res => {
        this.codigoProf = res['centro'];
        console.log(this.codigoProf);
        this.authService.establecercodigoProfesor(this.codigoProf);
        this.cargarCodigoProfesor(this.codigoProf);
        Swal.fire({
          icon: 'success',
          title: 'El código de profesor ha sido actualizado.',
          heightAuto: false
        });
      }, (err) => {
        Swal.fire({
          title: '¡Error!',
          text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false,
          heightAuto: false
        });
      })
  }

  generarCodigoAlumno(){
    const data = {
      uid : this.centroeducativoService.uid,
    };
    this.centroeducativoService.generarCodigoAlumno(data)
      .subscribe ( res => {
        this.codigoProf = res['centro'];
        this.authService.establecercodigoAlumno(this.codigoProf);
        this.cargarCodigoAlumno(this.codigoProf);
        Swal.fire({
          icon: 'success',
          title: 'El código de alumno ha sido actualizado.',
          heightAuto: false
        });
      }, (err) => {
        Swal.fire({
          title: '¡Error!',
          text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false,
          heightAuto: false
        });
      })
  }

  cargarCodigoProfesor( codigoProfesor: string ){
    document.getElementById("codigoProfesor").innerHTML = codigoProfesor;
  }

  cargarCodigoAlumno( codigoAlumno: string ){
    document.getElementById("codigoAlumno").innerHTML = codigoAlumno;
  }

}
