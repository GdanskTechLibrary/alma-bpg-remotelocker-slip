import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrappedSortableComponent } from './wrapped-sortable.component';

describe('WrappedSortableComponent', () => {
  let component: WrappedSortableComponent;
  let fixture: ComponentFixture<WrappedSortableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrappedSortableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrappedSortableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
