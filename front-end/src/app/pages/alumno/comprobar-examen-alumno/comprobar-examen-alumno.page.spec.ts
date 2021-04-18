import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComprobarExamenAlumnoPage } from './comprobar-examen-alumno.page';

describe('ComprobarExamenAlumnoPage', () => {
  let component: ComprobarExamenAlumnoPage;
  let fixture: ComponentFixture<ComprobarExamenAlumnoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobarExamenAlumnoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComprobarExamenAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
