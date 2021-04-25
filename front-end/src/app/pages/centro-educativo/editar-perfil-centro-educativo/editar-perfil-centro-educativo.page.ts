import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CentroeducativoService } from '../../../services/centroeducativo.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-editar-perfil-centro-educativo',
  templateUrl: './editar-perfil-centro-educativo.page.html',
  styleUrls: ['./editar-perfil-centro-educativo.page.scss'],
})
export class EditarPerfilCentroEducativoPage implements OnInit {

  public editarPerfil = this.fb.group({
    nombre: ['', Validators.required ],
    email: ['', [Validators.required, Validators.email] ],
    nuevopassword: [''],
    nuevopassword2: ['']
  });

  constructor(private fb: FormBuilder,
              public centroEducativoService: CentroeducativoService,
              private authService: AuthService) { }

  ngOnInit() {
    this.cargarCentro();
  }

  actualizarCentro(){
    this.centroEducativoService.actualizarCentro(this.centroEducativoService.uid, this.editarPerfil.value)
      .subscribe( res => {
        this.authService.establecerdatosCentro( res['centro'].nombre, res['centro'].email );
        this.cargarCentroActualizado(res['centro'].nombre, res['centro'].email);
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

  cargarCentro():void {
    this.editarPerfil.get('nombre').setValue(this.centroEducativoService.nombre);
    this.editarPerfil.get('email').setValue(this.centroEducativoService.email);
  }

  cargarCentroActualizado(nombre, email){
    this.editarPerfil.get('nombre').setValue(nombre);
    this.editarPerfil.get('email').setValue(email);
  }

}
