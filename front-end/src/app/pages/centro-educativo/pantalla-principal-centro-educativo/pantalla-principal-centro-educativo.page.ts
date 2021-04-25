import { Component, OnInit } from '@angular/core';
import { CentroeducativoService } from '../../../services/centroeducativo.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-pantalla-principal-centro-educativo',
  templateUrl: './pantalla-principal-centro-educativo.page.html',
  styleUrls: ['./pantalla-principal-centro-educativo.page.scss'],
})
export class PantallaPrincipalCentroEducativoPage implements OnInit {

  constructor(private centroeducativoService: CentroeducativoService,
              private authService: AuthService) { }

  ngOnInit() {
    this.authService.cogerToken();
  }

}
