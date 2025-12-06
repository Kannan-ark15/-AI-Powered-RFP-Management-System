import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RfpService } from '../../services/rfp.service'; 
import { VendorService } from '../../services/vendor.service'; 
import { RFP } from '../../models/rfp.model';
import { Vendor } from '../../models/vendor.model';

@Component({
  selector: 'app-send-rfp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule,
    MatSnackBarModule
  ],
  templateUrl: './send-rfp-component.component.html',
  styleUrls: ['./send-rfp-component.component.css']
})
export class SendRfpComponent implements OnInit {
  rfps: RFP[] = [];
  vendors: Vendor[] = [];
  selectedRfpId: string = '';
  selectedRfp: RFP | null = null;
  selectedVendorIds: string[] = [];
  sending = false;

  constructor(
    private rfpService: RfpService,
    private vendorService: VendorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.rfpService.getAll().subscribe(rfps => {
      this.rfps = rfps.filter((r: { status: string; }) => r.status === 'draft' || r.status === 'sent');
    });
    this.vendorService.getAll().subscribe(vendors => {
      this.vendors = vendors;
    });
  }

  onRfpSelected() {
    this.selectedRfp = this.rfps.find(r => r._id === this.selectedRfpId) || null;
  }

  sendRfp() {
    if (!this.selectedRfpId || !this.selectedVendorIds.length) return;

    this.sending = true;
    this.rfpService.send(this.selectedRfpId, this.selectedVendorIds).subscribe({
      next: () => {
        this.snackBar.open('RFP sent successfully!', 'Close', { duration: 3000 });
        this.sending = false;
        this.selectedVendorIds = [];
      },
      error: () => {
        this.snackBar.open('Error sending RFP', 'Close', { duration: 3000 });
        this.sending = false;
      }
    });
  }
}