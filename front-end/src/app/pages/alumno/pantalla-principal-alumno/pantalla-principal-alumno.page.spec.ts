import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PantallaPrincipalAlumnoPage } from './pantalla-principal-alumno.page';

describe('PantallaPrincipalAlumnoPage', () => {
  let component: PantallaPrincipalAlumnoPage;
  let fixture: ComponentFixture<PantallaPrincipalAlumnoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PantallaPrincipalAlumnoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PantallaPrincipalAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
