import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsComponentComponent } from './vendors-component.component';

describe('VendorsComponentComponent', () => {
  let component: VendorsComponentComponent;
  let fixture: ComponentFixture<VendorsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorsComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendorsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
