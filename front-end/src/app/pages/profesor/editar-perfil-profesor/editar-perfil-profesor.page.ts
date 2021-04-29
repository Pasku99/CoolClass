import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfesorService } from '../../../services/profesor.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-perfil-profesor',
  templateUrl: './editar-perfil-profesor.page.html',
  styleUrls: ['./editar-perfil-profesor.page.scss'],
})
export class EditarPerfilProfesorPage implements OnInit {

  public editarPerfil = this.fb.group({
    nombre: ['', Validators.required ],
    email: ['', [Validators.required, Validators.email] ],
    nuevopassword: [''],
    nuevopassword2: ['']
  });

  constructor(private fb: FormBuilder,
              private profesorService: ProfesorService,
              private authService: AuthService) { }

  ngOnInit() { }

  ionViewWillEnter(){
    this.cargarProfesor();
  }

  actualizarProfesor(){
    this.profesorService.actualizarProfesor(this.profesorService.uid, this.editarPerfil.value)
      .subscribe( res => {
        this.authService.establecerdatosProfesor( res['profesor'].nombre, res['profesor'].email );
        this.cargarProfesorActualizado(res['profesor'].nombre, res['profesor'].email);
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

  cargarProfesor():void {
    this.editarPerfil.get('nombre').setValue(this.profesorService.nombre);
    this.editarPerfil.get('email').setValue(this.profesorService.email);
  }

  cargarProfesorActualizado(nombre, email){
    this.editarPerfil.get('nombre').setValue(nombre);
    this.editarPerfil.get('email').setValue(email);
  }

}
