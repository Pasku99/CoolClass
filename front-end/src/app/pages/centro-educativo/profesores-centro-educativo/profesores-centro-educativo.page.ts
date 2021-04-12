import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profesores-centro-educativo',
  templateUrl: './profesores-centro-educativo.page.html',
  styleUrls: ['./profesores-centro-educativo.page.scss'],
})
export class ProfesoresCentroEducativoPage implements OnInit {

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
