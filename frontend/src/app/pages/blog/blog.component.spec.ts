import { TestBed, ComponentFixture } from '@angular/core/testing'
import { BlogComponent } from './blog.component'
import { NewsService } from '../../services/news.service'
import { CommonModule } from '@angular/common'
import { News } from '../../interfaces/news'

describe('BlogComponent', () => {
  let component: BlogComponent
  let fixture: ComponentFixture<BlogComponent>
  let newsService: jasmine.SpyObj<NewsService>

  beforeEach(async () => {
    const newsServiceSpy = jasmine.createSpyObj('NewsService', ['updateNews'])

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [CommonModule, BlogComponent],
      providers: [{ provide: NewsService, useValue: newsServiceSpy }],
    }).compileComponents()

    fixture = TestBed.createComponent(BlogComponent)
    component = fixture.componentInstance
    newsService = TestBed.inject(NewsService) as jasmine.SpyObj<NewsService>
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should fetch news from NewsService on initialization', () => {
    const mockNews: News[] = [
      {
        id: 1,
        autor: 'John Doe',
        urlImage: 'https://example.com/image.jpg',
        description: 'Lorem ipsum dolor sit amet',
        publicationDate: new Date(),
        title: 'News 1',
      },
      {
        id: 2,
        autor: 'Jane Smith',
        urlImage: 'https://example.com/image2.jpg',
        description: 'Consectetur adipiscing elit',
        publicationDate: new Date(),
        title: 'News 2',
      },
    ]

    newsService.updateNews.and.returnValue(mockNews)

    component.ngOnInit()

    expect(component.notice).toEqual(mockNews)
  })
})
