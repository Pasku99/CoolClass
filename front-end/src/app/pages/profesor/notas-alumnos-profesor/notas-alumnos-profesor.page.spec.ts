import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotasAlumnosProfesorPage } from './notas-alumnos-profesor.page';

describe('NotasAlumnosProfesorPage', () => {
  let component: NotasAlumnosProfesorPage;
  let fixture: ComponentFixture<NotasAlumnosProfesorPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotasAlumnosProfesorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotasAlumnosProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
