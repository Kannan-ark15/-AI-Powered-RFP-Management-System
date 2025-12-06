import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { RfpService } from '../../services/rfp.service'; 
import { ProposalService } from '../../services/proposal.service'; 
import { RFP } from '../../models/rfp.model';
import { Proposal } from '../../models/proposal.model';
import { Vendor } from '../../models/vendor.model';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatExpansionModule,
    MatChipsModule
  ],
  templateUrl: './inbox-component.component.html',
  styleUrls: ['./inbox-component.component.css']
})
export class InboxComponent implements OnInit {
  rfps: RFP[] = [];
  proposals: Proposal[] = [];
  selectedRfpId: string = '';

  constructor(
    private rfpService: RfpService,
    private proposalService: ProposalService
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
      });
    }
  }

  getVendorName(vendorId: string | Vendor): string {
    if (typeof vendorId === 'string') return 'Unknown Vendor';
    return vendorId.name;
  }
}