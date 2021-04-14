import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-pantalla-principal-profesor',
  templateUrl: './pantalla-principal-profesor.page.html',
  styleUrls: ['./pantalla-principal-profesor.page.scss'],
})
export class PantallaPrincipalProfesorPage implements OnInit {
  // @ViewChild(IonSlides) slides: IonSlides;

  @ViewChildren(IonSlides) slides: QueryList<IonSlides>;

  constructor() {}

  public moveForward(index: number): void {
    this.slides.toArray()[index].slideNext(500);
  }

  public moveBehind(index: number): void {
    this.slides.toArray()[index].slidePrev(500);
  }

  ngOnInit() {
  }

  // next( index) {
  //   this.slides.slideTo(index)
  // }

}
