import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EscogerAsignaturasConfigProfesorPage } from './escoger-asignaturas-config-profesor.page';

describe('EscogerAsignaturasConfigProfesorPage', () => {
  let component: EscogerAsignaturasConfigProfesorPage;
  let fixture: ComponentFixture<EscogerAsignaturasConfigProfesorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EscogerAsignaturasConfigProfesorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EscogerAsignaturasConfigProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
