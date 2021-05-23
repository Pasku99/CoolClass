import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.page.html',
  styleUrls: ['./recuperar-password.page.scss'],
})
export class RecuperarPasswordPage implements OnInit {

  public recoverForm = this.fb.group({
    email: ['', [Validators.required, Validators.email] ],
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService) { }

  ngOnInit() {
  }

  recover(){
    const data = {
      email : this.recoverForm.get('email').value,
    };
    this.authService.recoverPassword(data)
      .subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Correo de recuperación enviado a ' + data['email'] + '. Revise la bandeja de SPAM en caso de que no le haya llegado.',
          heightAuto: false
        });
        this.recoverForm.get('email').setValue('');
      }, (err => {
        Swal.fire({
          title: '¡Error!',
          text: err.error.msg || 'No pudo completarse la acción, vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false,
          heightAuto: false
        });
      }))
  }

}
