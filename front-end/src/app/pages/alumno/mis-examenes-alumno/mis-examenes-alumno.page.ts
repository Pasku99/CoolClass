import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-mis-examenes-alumno',
  templateUrl: './mis-examenes-alumno.page.html',
  styleUrls: ['./mis-examenes-alumno.page.scss'],
})
export class MisExamenesAlumnoPage implements OnInit {

  public items: any = [];

  constructor() {
    this.items = [
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false },
      { expanded: false }
    ];
  }

  expandItem(item): void {
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.items.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }

  ngOnInit() {
  }


}
