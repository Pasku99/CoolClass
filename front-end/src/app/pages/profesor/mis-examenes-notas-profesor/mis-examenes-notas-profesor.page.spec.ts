import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisExamenesNotasProfesorPage } from './mis-examenes-notas-profesor.page';

describe('MisExamenesNotasProfesorPage', () => {
  let component: MisExamenesNotasProfesorPage;
  let fixture: ComponentFixture<MisExamenesNotasProfesorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MisExamenesNotasProfesorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisExamenesNotasProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
