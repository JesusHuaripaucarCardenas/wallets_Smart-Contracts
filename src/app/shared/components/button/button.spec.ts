import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button';

describe('ButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the label', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentInstance.label = 'Conectar Pali Wallet';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Conectar Pali Wallet');
  });

  it('should emit clicked when not disabled', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    const spy = vi.fn();
    fixture.componentInstance.clicked.subscribe(spy);
    fixture.componentInstance.onClick();
    expect(spy).toHaveBeenCalled();
  });

  it('should NOT emit clicked when disabled', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    const spy = vi.fn();
    fixture.componentInstance.disabled = true;
    fixture.componentInstance.clicked.subscribe(spy);
    fixture.componentInstance.onClick();
    expect(spy).not.toHaveBeenCalled();
  });
});
