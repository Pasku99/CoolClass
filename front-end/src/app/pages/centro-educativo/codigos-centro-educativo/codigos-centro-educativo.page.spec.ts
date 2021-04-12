import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CodigosCentroEducativoPage } from './codigos-centro-educativo.page';

describe('CodigosCentroEducativoPage', () => {
  let component: CodigosCentroEducativoPage;
  let fixture: ComponentFixture<CodigosCentroEducativoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CodigosCentroEducativoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CodigosCentroEducativoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
