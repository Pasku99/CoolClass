import { Component, OnInit } from '@angular/core';
import { CentroeducativoService } from '../../../services/centroeducativo.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-perfil-centro-educativo',
  templateUrl: './perfil-centro-educativo.page.html',
  styleUrls: ['./perfil-centro-educativo.page.scss'],
})
export class PerfilCentroEducativoPage implements OnInit {

  constructor(private centroeducativoService: CentroeducativoService, private storage: Storage) { }

  ngOnInit() {
  }

  logout(){
    this.centroeducativoService.logout();
  }
}
