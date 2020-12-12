import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NubeTagsComponent } from './nube-tags.component';

describe('NubeTagsComponent', () => {
  let component: NubeTagsComponent;
  let fixture: ComponentFixture<NubeTagsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NubeTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NubeTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
