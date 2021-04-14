import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EscogerAsignaturasProfesorPage } from './escoger-asignaturas-profesor.page';

describe('EscogerAsignaturasProfesorPage', () => {
  let component: EscogerAsignaturasProfesorPage;
  let fixture: ComponentFixture<EscogerAsignaturasProfesorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EscogerAsignaturasProfesorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EscogerAsignaturasProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
