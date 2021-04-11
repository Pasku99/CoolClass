import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClaseAlumnosCentroEducativoPage } from './clase-alumnos-centro-educativo.page';

describe('ClaseAlumnosCentroEducativoPage', () => {
  let component: ClaseAlumnosCentroEducativoPage;
  let fixture: ComponentFixture<ClaseAlumnosCentroEducativoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaseAlumnosCentroEducativoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClaseAlumnosCentroEducativoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
