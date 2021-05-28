import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CentroeducativoService } from '../../../services/centroeducativo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-centro-educativo',
  templateUrl: './registro-centro-educativo.page.html',
  styleUrls: ['./registro-centro-educativo.page.scss'],
})
export class RegistroCentroEducativoPage implements OnInit {

  // private formSubmited = false;
  // public enablepass: boolean = true;
  // public showOKP: boolean = false;
  // public waiting: boolean = false;

  public registerForm = this.fb.group({
    nombre: ['', Validators.required ],
    email: ['', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    rol: ['ROL_CENTRO', Validators.required ],
  });

  public waiting: boolean = false;

  constructor(private fb: FormBuilder,
              private centroeducativoService: CentroeducativoService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
  }

  enviar(){
    this.waiting = true;
    this.centroeducativoService.nuevoCentro( this.registerForm.value )
      .subscribe( res => {
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
