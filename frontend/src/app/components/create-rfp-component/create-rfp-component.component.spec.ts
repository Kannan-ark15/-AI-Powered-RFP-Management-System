import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRfpComponentComponent } from './create-rfp-component.component';

describe('CreateRfpComponentComponent', () => {
  let component: CreateRfpComponentComponent;
  let fixture: ComponentFixture<CreateRfpComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRfpComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRfpComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
