import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AjustesCentroEducativoPage } from './ajustes-centro-educativo.page';

describe('AjustesCentroEducativoPage', () => {
  let component: AjustesCentroEducativoPage;
  let fixture: ComponentFixture<AjustesCentroEducativoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AjustesCentroEducativoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AjustesCentroEducativoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
