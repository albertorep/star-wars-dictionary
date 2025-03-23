import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Resource } from '../interfaces/resource.interface';
import { NgClass, NgFor, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-expanded-card',
  imports: [TitleCasePipe, NgFor, NgClass],
  templateUrl: './expanded-card.component.html',
  styleUrl: './expanded-card.component.scss'
})
export class ExpandedCardComponent {
  @Input() resource!: Resource;
  @Output() close = new EventEmitter<void>();

  entries: [string, any][] = [];
  isClosing = false;
  
  ngOnChanges(changes: SimpleChanges): void {
    const excludeKeys = ['id', 'name', 'type', 'created', 'edited', 'url'];
    this.entries = Object.entries(this.resource).filter(([key, value]) => {
      if (excludeKeys.includes(key.toLowerCase())) return false;
      if (value == null || value === '' || value === 'unknown' || value === 'n/a') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    });
  }

  formatKey(key: string): string {
    return key
      .replace(/_/g, ' ')                  // snake_case → spaces
      .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase → space before capital
      .replace(/\b\w/g, c => c.toUpperCase()); // capitalize each word
  }

  triggerClose() {
    this.isClosing = true;
    setTimeout(() => this.close.emit(), 300); // matches animation time
  }
}
