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

  private formSubmited = false;
  public enablepass: boolean = true;
  public showOKP: boolean = false;
  public waiting: boolean = false;

  public registerForm = this.fb.group({
    nombre: ['', Validators.required ],
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    rol: ['ROL_CENTRO', Validators.required ],
  });

  constructor(private fb: FormBuilder,
              private centroeducativoService: CentroeducativoService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
  }

  enviar(){
    this.formSubmited = true;
    // console.log(this.datosForm);
    if (this.registerForm.invalid) { return; }
    // Diferenciar entre dar de alta uno nuevo o actualizar uno que ya existe
    // Alta de uno nuevo
    this.waiting = true;
    this.centroeducativoService.nuevoCentro( this.registerForm.value )
      .subscribe( res => {
        // console.log('Entra aquí');
        this.waiting = false;
        this.registerForm.get('password').disable();
        this.enablepass = false;
        this.registerForm.markAsPristine();
        // localStorage.setItem('email', this.registerForm.value.email);
        this.router.navigateByUrl("/inicio-sesion")
      }, (err) => {
        const errtext = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo.';
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errtext,
        });
        this.waiting = false;
        return;
      });
  }

  cancelar(): void {
    this.router.navigateByUrl('/login');
  }

  campoNoValido( campo: string) {
    return this.registerForm.get(campo).invalid && this.formSubmited;
  }

  campoNoValidoPassword( campo: string) {
    if(this.registerForm.get(campo).value == "" && this.formSubmited){
      return true;
    }
    return false;
  }

}
