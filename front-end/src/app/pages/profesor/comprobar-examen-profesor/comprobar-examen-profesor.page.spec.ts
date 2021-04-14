import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComprobarExamenProfesorPage } from './comprobar-examen-profesor.page';

describe('ComprobarExamenProfesorPage', () => {
  let component: ComprobarExamenProfesorPage;
  let fixture: ComponentFixture<ComprobarExamenProfesorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobarExamenProfesorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComprobarExamenProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
