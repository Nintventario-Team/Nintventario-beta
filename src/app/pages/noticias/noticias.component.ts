import { Component } from '@angular/core';
import { NoticiasService } from '../../services/noticias.service';
import { Noticia } from '../../interfaces/noticia';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.css',
})
export class NoticiasComponent {
  public notice: Noticia[] = [];

  constructor(private noticiasService: NoticiasService) {}

  ngOnInit() {
    this.notice = this.noticiasService.updateNoticias();
  }
}
