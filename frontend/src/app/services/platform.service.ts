import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private platformSource = new BehaviorSubject<string>('')
  currentPlatform = this.platformSource.asObservable()

  private funkoCategorySource = new BehaviorSubject<string>('')
  currentFunkoCategory = this.funkoCategorySource.asObservable()

  private ConsolaCategorySource = new BehaviorSubject<string>('')
  CurrentConsolaCategory = this.ConsolaCategorySource.asObservable()

  private ArticleCategorySource = new BehaviorSubject<string>('')
  CurrentArticleCategory = this.ArticleCategorySource.asObservable()

  constructor() {}

  setPlatform(platform: string) {
    this.platformSource.next(platform)
  }

  setFunkoCategory(category: string) {
    this.funkoCategorySource.next(category)
  }

  setConsolaCategory(category: string) {
    this.ConsolaCategorySource.next(category)
  }

  setArticleCategory(category: string) {
    this.ArticleCategorySource.next(category)
  }
}
