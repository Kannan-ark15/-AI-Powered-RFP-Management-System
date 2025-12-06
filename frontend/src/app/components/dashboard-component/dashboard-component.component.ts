import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RfpService } from '../../services/rfp.service';
import { RFP } from '../../models/rfp.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  rfps: RFP[] = [];
  displayedColumns = ['title', 'budget', 'deadline', 'status'];
  draftCount = 0;
  sentCount = 0;
  closedCount = 0;

  constructor(private rfpService: RfpService) {}

  ngOnInit() {
    this.rfpService.getAll().subscribe(rfps => {
      this.rfps = rfps;
      this.draftCount = rfps.filter(r => r.status === 'draft').length;
      this.sentCount = rfps.filter(r => r.status === 'sent').length;
      this.closedCount = rfps.filter(r => r.status === 'closed').length;
    });
  }

  getStatusColor(status: string) {
    return status === 'sent' ? 'primary' : status === 'closed' ? 'accent' : '';
  }
}