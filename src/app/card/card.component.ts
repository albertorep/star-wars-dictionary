import { Component, Input } from '@angular/core';
import { Resource } from '../interfaces/resource.interface';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() resource!: Resource;
}