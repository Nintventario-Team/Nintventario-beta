import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MetodosPagoComponent } from './metodos-pago.component'
import { ActivatedRoute } from '@angular/router'

describe('MetodosPagoComponent', () => {
  let component: MetodosPagoComponent
  let fixture: ComponentFixture<MetodosPagoComponent>
  let activatedRouteMock: any

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetodosPagoComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodosPagoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display payment methods', () => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('.payment-methods')).not.toBeNull()
  })
})
