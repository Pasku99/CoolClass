import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProfesorService } from '../../../services/profesor.service';

@Component({
  selector: 'app-perfil-profesor',
  templateUrl: './perfil-profesor.page.html',
  styleUrls: ['./perfil-profesor.page.scss'],
})
export class PerfilProfesorPage implements OnInit {

  constructor(private authService: AuthService,
              public profesorService: ProfesorService) { }

  ngOnInit() {
  }

  logout(){
    this.authService.logout();
  }

}
