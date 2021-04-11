import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfesoresClaseCentroEducativoPage } from './profesores-clase-centro-educativo.page';

describe('ProfesoresClaseCentroEducativoPage', () => {
  let component: ProfesoresClaseCentroEducativoPage;
  let fixture: ComponentFixture<ProfesoresClaseCentroEducativoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfesoresClaseCentroEducativoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfesoresClaseCentroEducativoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
