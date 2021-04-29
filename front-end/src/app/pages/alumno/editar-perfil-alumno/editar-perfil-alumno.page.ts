import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlumnoService } from 'src/app/services/alumno.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-editar-perfil-alumno',
  templateUrl: './editar-perfil-alumno.page.html',
  styleUrls: ['./editar-perfil-alumno.page.scss'],
})
export class EditarPerfilAlumnoPage implements OnInit {

  public editarPerfil = this.fb.group({
    nombre: ['', Validators.required ],
    email: ['', [Validators.required, Validators.email] ],
    nuevopassword: [''],
    nuevopassword2: ['']
  });

  constructor(private fb: FormBuilder,
              private alumnoService: AlumnoService,
              private authService: AuthService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.cargarAlumno();
  }

  actualizarAlumno(){
    this.alumnoService.actualizarAlumno(this.alumnoService.uid, this.editarPerfil.value)
      .subscribe( res => {
        this.authService.establecerdatosAlumno( res['alumno'].nombre, res['alumno'].email );
        this.cargarAlumnoActualizado(res['alumno'].nombre, res['alumno'].email);
        Swal.fire({
          icon: 'success',
          title: 'Su perfil ha sido actualizado',
          heightAuto: false
        });
      }, (err => {
        Swal.fire({
          title: '¡Error!',
          text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false,
          heightAuto: false
        });
      }));
  }

  cargarAlumno():void {
    this.editarPerfil.get('nombre').setValue(this.alumnoService.nombre);
    this.editarPerfil.get('email').setValue(this.alumnoService.email);
  }

  cargarAlumnoActualizado(nombre, email){
    this.editarPerfil.get('nombre').setValue(nombre);
    this.editarPerfil.get('email').setValue(email);
  }

}
