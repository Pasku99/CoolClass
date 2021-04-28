import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlumnoService } from '../../../services/alumno.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-alumno',
  templateUrl: './registro-alumno.page.html',
  styleUrls: ['./registro-alumno.page.scss'],
})
export class RegistroAlumnoPage implements OnInit {

  public registerForm = this.fb.group({
    nombre: ['', Validators.required ],
    email: ['', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    rol: ['ROL_ALUMNO', Validators.required ],
    codigoAlumno: ['', Validators.required]
  });

  constructor(private fb: FormBuilder,
              private alumnoService: AlumnoService,
              private router: Router) { }

  ngOnInit() {
  }

  enviar(){
    this.alumnoService.nuevoAlumno( this.registerForm.value )
      .subscribe( res => {
        Swal.fire({
          icon: 'success',
          title: 'Registrado con éxito',
          heightAuto: false
        });
        this.router.navigateByUrl("/inicio-sesion");
      }, (err) => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errtext,
        });
        return;
      });
  }

  cancelar(): void {
    this.router.navigateByUrl('/inicio-sesion');
  }
}
