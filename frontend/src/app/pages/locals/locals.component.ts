import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
@Component({
  selector: 'app-locals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './locals.component.html',
  styleUrl: './locals.component.css',
})
export class LocalsComponent {
  images: { url: string; name: string }[] = [
    {
      url: 'https://firebasestorage.googleapis.com/v0/b/nintventario.appspot.com/o/img%2Flocals%2Fceibos.jpg?alt=media&token=aa459369-3801-4035-83eb-8fd4183bc327',
      name: 'Ceibos',
    },
    {
      url: 'https://firebasestorage.googleapis.com/v0/b/nintventario.appspot.com/o/img%2Flocals%2Fentre%20rios.jpg?alt=media&token=b8d36f3b-1dbb-4e49-8928-b95b9e5bbfd4',
      name: 'Entre Ríos',
    },
    {
      url: 'https://firebasestorage.googleapis.com/v0/b/nintventario.appspot.com/o/img%2Flocals%2Fmachala.jpg?alt=media&token=7d5bbd74-208a-4f33-b768-8917380a2233',
      name: 'Machala',
    },
  ]
  currentSlide = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slideInterval: any

  ngOnInit(): void {
    this.startAutoSlide()
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval)
    }
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide()
    }, 5000)
  }

  prevSlide() {
    this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.images.length - 1
  }

  nextSlide() {
    this.currentSlide = this.currentSlide < this.images.length - 1 ? this.currentSlide + 1 : 0
  }
}
