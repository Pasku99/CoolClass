import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-registro-alumno',
  templateUrl: './registro-alumno.page.html',
  styleUrls: ['./registro-alumno.page.scss'],
})
export class RegistroAlumnoPage implements OnInit {

  public registerForm = this.fb.group({
    nombre: ['', Validators.required ],
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    codigo: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
