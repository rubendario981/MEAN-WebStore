import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DescripcionProductoComponent } from './descripcion-producto.component';

describe('DescripcionProductoComponent', () => {
  let component: DescripcionProductoComponent;
  let fixture: ComponentFixture<DescripcionProductoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DescripcionProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescripcionProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
