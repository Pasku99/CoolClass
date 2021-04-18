import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mis-notas-alumno',
  templateUrl: './mis-notas-alumno.page.html',
  styleUrls: ['./mis-notas-alumno.page.scss'],
})
export class MisNotasAlumnoPage implements OnInit {

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
