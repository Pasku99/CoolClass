import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PantallaPrincipalProfesorPage } from './pantalla-principal-profesor.page';

describe('PantallaPrincipalProfesorPage', () => {
  let component: PantallaPrincipalProfesorPage;
  let fixture: ComponentFixture<PantallaPrincipalProfesorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PantallaPrincipalProfesorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PantallaPrincipalProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
