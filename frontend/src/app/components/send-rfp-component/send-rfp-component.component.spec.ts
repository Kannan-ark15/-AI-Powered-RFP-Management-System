import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendRfpComponentComponent } from './send-rfp-component.component';

describe('SendRfpComponentComponent', () => {
  let component: SendRfpComponentComponent;
  let fixture: ComponentFixture<SendRfpComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendRfpComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendRfpComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
