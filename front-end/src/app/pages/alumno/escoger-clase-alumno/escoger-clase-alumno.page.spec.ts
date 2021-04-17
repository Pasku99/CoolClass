import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EscogerClaseAlumnoPage } from './escoger-clase-alumno.page';

describe('EscogerClaseAlumnoPage', () => {
  let component: EscogerClaseAlumnoPage;
  let fixture: ComponentFixture<EscogerClaseAlumnoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EscogerClaseAlumnoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EscogerClaseAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
