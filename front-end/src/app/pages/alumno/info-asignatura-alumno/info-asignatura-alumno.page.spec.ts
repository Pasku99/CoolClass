import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoAsignaturaAlumnoPage } from './info-asignatura-alumno.page';

describe('InfoAsignaturaAlumnoPage', () => {
  let component: InfoAsignaturaAlumnoPage;
  let fixture: ComponentFixture<InfoAsignaturaAlumnoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoAsignaturaAlumnoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoAsignaturaAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
