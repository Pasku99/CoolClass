import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clase-alumnos-notas-centro-educativo',
  templateUrl: './clase-alumnos-notas-centro-educativo.page.html',
  styleUrls: ['./clase-alumnos-notas-centro-educativo.page.scss'],
})
export class ClaseAlumnosNotasCentroEducativoPage implements OnInit {

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
