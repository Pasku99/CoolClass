import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-perfil-profesor',
  templateUrl: './editar-perfil-profesor.page.html',
  styleUrls: ['./editar-perfil-profesor.page.scss'],
})
export class EditarPerfilProfesorPage implements OnInit {

  public editarPerfil = this.fb.group({
    nombre: ['', Validators.required ],
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
