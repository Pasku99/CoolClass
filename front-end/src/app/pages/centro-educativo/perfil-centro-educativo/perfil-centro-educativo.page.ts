import { Component, OnInit } from '@angular/core';
import { CentroeducativoService } from '../../../services/centroeducativo.service';
import { Storage } from '@ionic/storage';
import Swal from 'sweetalert2'
import { CentroEducativo } from '../../../models/centroeducativo.model';

@Component({
  selector: 'app-perfil-centro-educativo',
  templateUrl: './perfil-centro-educativo.page.html',
  styleUrls: ['./perfil-centro-educativo.page.scss'],
})
export class PerfilCentroEducativoPage implements OnInit {

  constructor( public centroeducativoService: CentroeducativoService ) { }

  ngOnInit() {
  }

  logout(){
    this.centroeducativoService.logout();
  }

}
