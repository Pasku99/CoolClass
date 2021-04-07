import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-centro-educativo',
  templateUrl: './registro-centro-educativo.page.html',
  styleUrls: ['./registro-centro-educativo.page.scss'],
})
export class RegistroCentroEducativoPage implements OnInit {

  public registerForm = this.fb.group({
    nombre: ['', Validators.required ],
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    remember: [ false || localStorage.getItem('email') ]
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
