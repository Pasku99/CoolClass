import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-perfil-centro-educativo',
  templateUrl: './editar-perfil-centro-educativo.page.html',
  styleUrls: ['./editar-perfil-centro-educativo.page.scss'],
})
export class EditarPerfilCentroEducativoPage implements OnInit {

  public editarPerfil = this.fb.group({
    nombre: ['', Validators.required ],
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    codigo: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
