import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VendorService } from '../../services/vendor.service';
import { Vendor } from '../../models/vendor.model';
import { VendorDialogComponent } from '../vendor-dialog-component/vendor-dialog-component.component';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './vendors-component.component.html',
  styleUrls: ['./vendors-component.component.css']
})
export class VendorsComponent implements OnInit {
  vendors: Vendor[] = [];
  displayedColumns = ['name', 'email', 'company', 'phone', 'actions'];

  constructor(
    private vendorService: VendorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadVendors();
  }

  loadVendors() {
    this.vendorService.getAll().subscribe(vendors => {
      this.vendors = vendors;
    });
  }

  openDialog(vendor?: Vendor) {
    const dialogRef = this.dialog.open(VendorDialogComponent, {
      width: '500px',
      data: vendor || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (vendor?._id) {
          this.vendorService.update(vendor._id, result).subscribe({
            next: () => {
              this.snackBar.open('Vendor updated!', 'Close', { duration: 3000 });
              this.loadVendors();
            },
            error: () => this.snackBar.open('Error updating vendor', 'Close', { duration: 3000 })
          });
        } else {
          this.vendorService.create(result).subscribe({
            next: () => {
              this.snackBar.open('Vendor added!', 'Close', { duration: 3000 });
              this.loadVendors();
            },
            error: () => this.snackBar.open('Error adding vendor', 'Close', { duration: 3000 })
          });
        }
      }
    });
  }
}