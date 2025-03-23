import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() name = '';
  @Input() width = '18px';
  @Input() height = '18px';
  @Input() active = false;
  @Input() hover = false;
  @Input() isSquare = false;

  get className() {
    return `icon-${this.name}`;
  }
}
