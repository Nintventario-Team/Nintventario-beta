import { Component } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { News } from '../../interfaces/news';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  public notice: News[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.notice = this.newsService.updateNews();
  }
}
