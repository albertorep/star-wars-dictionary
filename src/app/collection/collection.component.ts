import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  tabName: string = '';

  constructor(private route: ActivatedRoute, private titleService: Title) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tabName = params.get('tabId') || 'Collection';
      this.titleService.setTitle(`${this.tabName} | Star Wars Explorer`);
    });
  }
}
