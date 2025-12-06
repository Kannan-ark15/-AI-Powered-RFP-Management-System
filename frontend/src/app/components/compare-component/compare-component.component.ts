import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { RfpService } from '../../services/rfp.service'; 
import { ProposalService } from '../../services/proposal.service'; 
import { AiService } from '../../services/ai.service'; 
import { RFP } from '../../models/rfp.model';
import { Proposal } from '../../models/proposal.model';
import { Vendor } from '../../models/vendor.model';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './compare-component.component.html',
  styleUrls: ['./compare-component.component.css']
})
export class CompareComponent implements OnInit {
  rfps: RFP[] = [];
  proposals: Proposal[] = [];
  selectedRfpId: string = '';
  comparing = false;
  comparison: any = null;
  displayedColumns = ['vendor', 'cost', 'timeline', 'teamSize', 'experience'];

  constructor(
    private rfpService: RfpService,
    private proposalService: ProposalService,
    private aiService: AiService
  ) {}

  ngOnInit() {
    this.rfpService.getAll().subscribe(rfps => {
      this.rfps = rfps.filter((r: { status: string; }) => r.status === 'sent');
    });
  }

  loadProposals() {
    if (this.selectedRfpId) {
      this.proposalService.getByRfp(this.selectedRfpId).subscribe(proposals => {
        this.proposals = proposals;
        this.comparison = null;
      });
    }
  }

  compareProposals() {
    if (!this.selectedRfpId) return;

    this.comparing = true;
    this.aiService.compare(this.selectedRfpId).subscribe({
      next: (result) => {
        this.comparison = result;
        this.comparing = false;
      },
      error: () => {
        this.comparing = false;
      }
    });
  }

  getVendorName(vendorId: string | Vendor): string {
    if (typeof vendorId === 'string') return 'Unknown Vendor';
    return vendorId.name;
  }
}