import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-pantalla-principal-alumno',
  templateUrl: './pantalla-principal-alumno.page.html',
  styleUrls: ['./pantalla-principal-alumno.page.scss'],
})
export class PantallaPrincipalAlumnoPage implements OnInit {

  @ViewChildren(IonSlides) slides: QueryList<IonSlides>;

  constructor(private authService: AuthService) {}

  public moveForward(index: number): void {
    this.slides.toArray()[index].slideNext(500);
  }

  public moveBehind(index: number): void {
    this.slides.toArray()[index].slidePrev(500);
  }

  ngOnInit() {
    this.authService.cogerToken();
  }

}
