import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { WishlistResponse } from '../../interfaces/wishlist'
import { CommonModule } from '@angular/common'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'app-wishlist-modal',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink],

  templateUrl: './wishlist-modal.component.html',
  styleUrls: ['./wishlist-modal.component.css'],
})
export class WishlistModalComponent {
  constructor(
    private router: Router,

    public dialogRef: MatDialogRef<WishlistModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { products: WishlistResponse[] },
  ) {}

  onClose() {
    this.dialogRef.close()
  }
  replaceUnderscores(name: string): string {
    return name.replace(/_/g, ' ')
  }
  goToStore() {
    this.dialogRef.close()
    this.router.navigate(['/todos'])
  }
  goToProductDetails() {
    throw new Error('Method not implemented.')
  }
}
