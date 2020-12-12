import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormularioRegistroComponent } from './formulario-registro.component';

describe('FormularioRegistroComponent', () => {
  let component: FormularioRegistroComponent;
  let fixture: ComponentFixture<FormularioRegistroComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioRegistroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
