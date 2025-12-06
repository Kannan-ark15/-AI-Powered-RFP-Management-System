import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareComponentComponent } from './compare-component.component';

describe('CompareComponentComponent', () => {
  let component: CompareComponentComponent;
  let fixture: ComponentFixture<CompareComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompareComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
