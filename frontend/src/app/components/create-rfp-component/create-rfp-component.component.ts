import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RfpService } from '../../services/rfp.service'; 
import { AiService } from '../../services/ai.service'; 

@Component({
  selector: 'app-create-rfp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './create-rfp-component.component.html',
  styleUrls: ['./create-rfp-component.component.css']
})
export class CreateRfpComponent {
  showForm = false;
  naturalText = '';
  parsing = false;
  submitting = false;
  rfpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private rfpService: RfpService,
    private aiService: AiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.rfpForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      requirements: this.fb.array([]),
      deadline: ['', Validators.required],
      budget: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      status: ['draft']
    });
  }

  get requirements() {
    return this.rfpForm.get('requirements') as FormArray;
  }

  addRequirement() {
    this.requirements.push(this.fb.control(''));
  }

  removeRequirement(index: number) {
    this.requirements.removeAt(index);
  }

  parseWithAI() {
    this.parsing = true;
    this.aiService.parseRFP(this.naturalText).subscribe({
      next: (parsed) => {
        this.rfpForm.patchValue({
          title: parsed.title,
          description: parsed.description,
          deadline: parsed.deadline,
          budget: parsed.budget,
          contactEmail: parsed.contactEmail
        });
        
        this.requirements.clear();
        (parsed.requirements || []).forEach((req: string) => {
          this.requirements.push(this.fb.control(req));
        });

        this.showForm = true;
        this.parsing = false;
        this.snackBar.open('RFP parsed successfully!', 'Close', { duration: 3000 });
      },
      error: () => {
        this.parsing = false;
        this.snackBar.open('Error parsing RFP', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit() {
    if (this.rfpForm.valid) {
      this.submitting = true;
      const rfpData = {
        ...this.rfpForm.value,
        requirements: this.requirements.value.filter((r: string) => r.trim())
      };

      this.rfpService.create(rfpData).subscribe({
        next: () => {
          this.snackBar.open('RFP created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.submitting = false;
          this.snackBar.open('Error creating RFP', 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}