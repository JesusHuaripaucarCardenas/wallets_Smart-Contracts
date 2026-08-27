import { TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert';

describe('AlertComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AlertComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should not render anything when message is null', () => {
    const fixture = TestBed.createComponent(AlertComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.app-alert')).toBeNull();
  });

  it('should render the message with the correct type class', () => {
    const fixture = TestBed.createComponent(AlertComponent);
    fixture.componentInstance.type = 'error';
    fixture.componentInstance.message = 'No se detectó Pali Wallet';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const alertEl = el.querySelector('.app-alert--error');
    expect(alertEl?.textContent).toContain('No se detectó Pali Wallet');
  });
});
