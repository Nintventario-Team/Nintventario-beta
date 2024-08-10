import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TerminosCondicionesComponent } from './terminos-condiciones.component'
import { ActivatedRoute } from '@angular/router'

describe('TerminosCondicionesComponent', () => {
  let component: TerminosCondicionesComponent
  let fixture: ComponentFixture<TerminosCondicionesComponent>
  let activatedRouteMock: any

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminosCondicionesComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminosCondicionesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display the title', () => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('.title').textContent).toContain('Terminos y condiciones')
  })

  it('should display the last update date', () => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('h3').textContent).toContain('Última actualización: 03/08/2024')
  })

  it('should list all policies', () => {
    const compiled = fixture.debugElement.nativeElement
    const policies = compiled.querySelectorAll('.policy')
    expect(policies.length).toBe(6)
    expect(policies[0].querySelector('h3').textContent).toContain('Modificaciones de los términos')
    expect(policies[1].querySelector('h3').textContent).toContain('Uso del Sitio Web')
  })
})
