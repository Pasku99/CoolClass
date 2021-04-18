import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-perfil-alumno',
  templateUrl: './editar-perfil-alumno.page.html',
  styleUrls: ['./editar-perfil-alumno.page.scss'],
})
export class EditarPerfilAlumnoPage implements OnInit {

  public editarPerfil = this.fb.group({
    nombre: ['', Validators.required ],
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
