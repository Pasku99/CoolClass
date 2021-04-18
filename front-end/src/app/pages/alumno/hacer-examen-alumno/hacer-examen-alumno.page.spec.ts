import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HacerExamenAlumnoPage } from './hacer-examen-alumno.page';

describe('HacerExamenAlumnoPage', () => {
  let component: HacerExamenAlumnoPage;
  let fixture: ComponentFixture<HacerExamenAlumnoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HacerExamenAlumnoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HacerExamenAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
