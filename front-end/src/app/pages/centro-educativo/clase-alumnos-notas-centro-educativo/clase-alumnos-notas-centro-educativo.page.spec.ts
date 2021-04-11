import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClaseAlumnosNotasCentroEducativoPage } from './clase-alumnos-notas-centro-educativo.page';

describe('ClaseAlumnosNotasCentroEducativoPage', () => {
  let component: ClaseAlumnosNotasCentroEducativoPage;
  let fixture: ComponentFixture<ClaseAlumnosNotasCentroEducativoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaseAlumnosNotasCentroEducativoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClaseAlumnosNotasCentroEducativoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
