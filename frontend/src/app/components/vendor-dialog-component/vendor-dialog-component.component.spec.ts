import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDialogComponentComponent } from './vendor-dialog-component.component';

describe('VendorDialogComponentComponent', () => {
  let component: VendorDialogComponentComponent;
  let fixture: ComponentFixture<VendorDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorDialogComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendorDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
