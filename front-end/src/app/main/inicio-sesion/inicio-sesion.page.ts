import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { CentroEducativo } from '../../models/centroeducativo.model';
import { Router } from '@angular/router';
import { CentroeducativoService } from '../../services/centroeducativo.service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-inicio-sesion',
  providers: [CentroeducativoService],
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {

  private centro: CentroEducativo;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    // remember: [ false || localStorage.getItem('email') ]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              public centroeducativoService: CentroeducativoService,
              private router: Router,
              private zone: NgZone) {  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.zone.run(() => {
      console.log('force update the screen');
    });
  }

  login() {
    const data = {
      email : this.loginForm.get('email').value,
    };
    this.authService.buscarTipo(data)
      .subscribe( res => {
        // console.log(res['resultado']);
        if(res['resultado'][0].rol == 'ROL_CENTRO'){
          this.centroeducativoService.loginCentroEducativo(this.loginForm.value)
            .subscribe( res => {
              // this.router.navigateByUrl('/tabs-centro-educativo/principal');
              this.router.navigate(['/tabs-centro-educativo/principal'])
                .then(() => {
                  window.location.reload();
                });
            }, (err) =>{
              Swal.fire({
                title: '¡Error!',
                text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
                icon: 'error',
                confirmButtonText: 'Ok',
                allowOutsideClick: false,
                heightAuto: false
              });
            });
        }
      }, (err) => {
        Swal.fire({
          title: 'Error!',
          text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false,
          heightAuto: false
        });
      });
  }


}
