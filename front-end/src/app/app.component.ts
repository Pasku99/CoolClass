import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { CentroeducativoService } from './services/centroeducativo.service';
import { ProfesorService } from './services/profesor.service';
// import { Plugins, StatusBarStyle } from '@capacitor/core';
import { Plugins, PluginRegistry, Capacitor, StatusBarStyle } from '@capacitor/core';

const { SplashScreen, StatusBar }: PluginRegistry = Plugins;

// const { SplashScreen, StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public entra = false;
  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private centroeducativoService: CentroeducativoService,
    private profesorService: ProfesorService,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('StatusBar')) {
        StatusBar.setStyle({style: StatusBarStyle.Light})
      };
      SplashScreen.hide();

      this.authService.authenticationState.subscribe(res => {
        if (res) {
          this.authService.cogerToken();
        } else {
          this.router.navigateByUrl('inicio-sesion');
        }
      });
    });
  }
}
