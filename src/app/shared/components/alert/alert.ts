import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type AlertType = 'error' | 'success' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() message: string | null = null;
}
