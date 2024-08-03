import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WishlistResponse } from '../../interfaces/wishlist';

@Component({
  selector: 'app-wishlist-modal',
  templateUrl: './wishlist-modal.component.html',
  styleUrls: ['./wishlist-modal.component.css'],
})
export class WishlistModalComponent {
  constructor(
    public dialogRef: MatDialogRef<WishlistModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { products: WishlistResponse[] }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
