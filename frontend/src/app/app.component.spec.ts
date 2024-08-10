import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { Component } from '@angular/core'
import { RouterTestingModule } from '@angular/router/testing'
import { ProductService } from './services/product.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'

// Mock components for the ones used in the template
@Component({ selector: 'app-navbar', template: '' })
class MockNavbarComponent {}

@Component({ selector: 'app-mid-banner', template: '' })
class MockMidBannerComponent {}

@Component({ selector: 'app-banner', template: '' })
class MockBannerComponent {}

@Component({ selector: 'app-footer', template: '' })
class MockFooterComponent {}

describe('AppComponent', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MockNavbarComponent, MockMidBannerComponent, MockBannerComponent, MockFooterComponent],
      imports: [AppComponent, RouterTestingModule,HttpClientTestingModule],      providers: [ProductService], 

    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the app', () => {
    expect(component).toBeTruthy()
  })

  it('should render navbar component', () => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('app-navbar')).not.toBeNull()
  })

  it('should conditionally render mid-banner or banner', () => {
    component.isIndexPage = true
    fixture.detectChanges()
    let compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('app-banner')).not.toBeNull()
    expect(compiled.querySelector('app-mid-banner')).toBeNull()

    component.isIndexPage = false
    fixture.detectChanges()
    compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('app-mid-banner')).not.toBeNull()
    expect(compiled.querySelector('app-banner')).toBeNull()
  })

  it('should render footer component', () => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('app-footer')).not.toBeNull()
  })
})
