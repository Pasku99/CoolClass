import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegistroCentroEducativoPage } from './registro-centro-educativo.page';

describe('RegistroCentroEducativoPage', () => {
  let component: RegistroCentroEducativoPage;
  let fixture: ComponentFixture<RegistroCentroEducativoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroCentroEducativoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroCentroEducativoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
