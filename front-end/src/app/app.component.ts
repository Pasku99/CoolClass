import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { CentroeducativoService } from './services/centroeducativo.service';
import { ProfesorService } from './services/profesor.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public entra = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private centroeducativoService: CentroeducativoService,
    private profesorService: ProfesorService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.centroeducativoService.authenticationState.subscribe(res => {
        if (res) {
          this.entra = true;
          this.router.navigateByUrl('/tabs-centro-educativo/principal');
          this.centroeducativoService.cogerToken();
        } else {
          this.router.navigateByUrl('/inicio-sesion');
        }
      });
    });
  }
}
