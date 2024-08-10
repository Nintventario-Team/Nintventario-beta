import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SobreNosotrosComponent } from './sobre-nosotros.component';

describe('SobreNosotrosComponent', () => {
  let component: SobreNosotrosComponent;
  let fixture: ComponentFixture<SobreNosotrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SobreNosotrosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SobreNosotrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display about us content', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('SOBRE NOSOTROS');
    expect(compiled.querySelector('p').textContent).toContain('Bienvenidos a Mágico Mundo del Nintendo');
  });

  it('should display sections with titles', () => {
    const compiled = fixture.debugElement.nativeElement;
    const sectionTitles = compiled.querySelectorAll('#n-text');
    expect(sectionTitles.length).toBe(3);
    expect(sectionTitles[0].textContent).toContain('NUESTRA HISTORIA');
    expect(sectionTitles[1].textContent).toContain('NUESTRA MÍSION');
    expect(sectionTitles[2].textContent).toContain('CONÉCTATE CON NOSOTROS');
  });

  it('should contain images for each section', () => {
    const compiled = fixture.debugElement.nativeElement;
    const images = compiled.querySelectorAll('.our-container img');
    expect(images.length).toBe(2);
  });
});
