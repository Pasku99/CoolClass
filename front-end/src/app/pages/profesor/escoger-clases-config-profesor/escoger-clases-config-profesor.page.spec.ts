import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EscogerClasesConfigProfesorPage } from './escoger-clases-config-profesor.page';

describe('EscogerClasesConfigProfesorPage', () => {
  let component: EscogerClasesConfigProfesorPage;
  let fixture: ComponentFixture<EscogerClasesConfigProfesorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EscogerClasesConfigProfesorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EscogerClasesConfigProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
