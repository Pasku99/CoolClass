import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisAsignaturasAlumnoPage } from './mis-asignaturas-alumno.page';

describe('MisAsignaturasAlumnoPage', () => {
  let component: MisAsignaturasAlumnoPage;
  let fixture: ComponentFixture<MisAsignaturasAlumnoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MisAsignaturasAlumnoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisAsignaturasAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
