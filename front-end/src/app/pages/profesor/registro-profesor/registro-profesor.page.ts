import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfesorService } from '../../../services/profesor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-profesor',
  templateUrl: './registro-profesor.page.html',
  styleUrls: ['./registro-profesor.page.scss'],
})
export class RegistroProfesorPage implements OnInit {

  public registerForm = this.fb.group({
    nombre: ['', Validators.required ],
    email: ['', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    rol: ['ROL_PROFESOR', Validators.required ],
    codigoProfesor: ['', Validators.required]
  });

  public waiting: boolean = false;

  constructor(private fb: FormBuilder,
    private profesorService: ProfesorService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
  }

  enviar(){
    this.waiting = true;
    this.profesorService.nuevoProfesor( this.registerForm.value )
      .subscribe( res => {
        Swal.fire({
          icon: 'success',
          title: 'Registrado con éxito',
          heightAuto: false
        });
        this.router.navigateByUrl("/inicio-sesion");
        this.waiting = false;
      }, (err) => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errtext,
          heightAuto: false
        });
        this.waiting = false;
        return;
      });
  }

  cancelar(): void {
    this.router.navigateByUrl('/inicio-sesion');
  }

}
