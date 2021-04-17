import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-info-asignatura-alumno',
  templateUrl: './info-asignatura-alumno.page.html',
  styleUrls: ['./info-asignatura-alumno.page.scss'],
})
export class InfoAsignaturaAlumnoPage implements OnInit {

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

}
