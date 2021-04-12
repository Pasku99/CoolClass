import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-clases-centro-educativo',
  templateUrl: './clases-centro-educativo.page.html',
  styleUrls: ['./clases-centro-educativo.page.scss'],
})
export class ClasesCentroEducativoPage implements OnInit {

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

  ngOnInit(){}

  anyadirClase(){
    Swal.fire({
      title: 'AÑADIR CLASE',
      input: "text",
      showCancelButton: true,
      // confirmButtonText: '<p style="color: black; font-size: 17px;">Añadir clase</p>',
      confirmButtonText: 'Añadir clase',
      confirmButtonColor: '#004dff',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'black',
      allowOutsideClick: false,
      heightAuto: false,
      // background: '#004dff',
      inputValidator: text => {
        // Si el valor es válido, debes regresar undefined. Si no, una cadena
        if (!text) {
            return "Por favor, escriba bien la clase";
        } else {
            return undefined;
        }
      }
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          '¡Añadida!',
          'Clase añadida con éxito',
          'success'
        )
      }
    });
  }

}
