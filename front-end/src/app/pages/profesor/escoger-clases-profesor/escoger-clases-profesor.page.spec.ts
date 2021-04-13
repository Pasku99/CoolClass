import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EscogerClasesProfesorPage } from './escoger-clases-profesor.page';

describe('EscogerClasesProfesorPage', () => {
  let component: EscogerClasesProfesorPage;
  let fixture: ComponentFixture<EscogerClasesProfesorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EscogerClasesProfesorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EscogerClasesProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
