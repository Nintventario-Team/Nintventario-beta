import { TestBed } from '@angular/core/testing';
import { NewsService } from './news.service';
import { News } from '../interfaces/news';

describe('NewsService', () => {
  let service: NewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsService],
    });
    service = TestBed.inject(NewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return correct news list', () => {
    const news: News[] = service.updateNews();
    expect(news.length).toBeGreaterThan(0);
    expect(news).toEqual(service.notice);
  });
});
