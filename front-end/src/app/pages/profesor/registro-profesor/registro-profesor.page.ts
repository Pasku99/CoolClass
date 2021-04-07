import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-profesor',
  templateUrl: './registro-profesor.page.html',
  styleUrls: ['./registro-profesor.page.scss'],
})
export class RegistroProfesorPage implements OnInit {

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
