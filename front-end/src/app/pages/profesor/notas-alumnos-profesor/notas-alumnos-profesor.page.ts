import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notas-alumnos-profesor',
  templateUrl: './notas-alumnos-profesor.page.html',
  styleUrls: ['./notas-alumnos-profesor.page.scss'],
})
export class NotasAlumnosProfesorPage implements OnInit {

  public items: any = [];
  public uidClase: string = '';

  constructor(private route: ActivatedRoute) {
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

  ionViewWillEnter() {
    this.uidClase = this.route.snapshot.params['idClase'];
  }

}
