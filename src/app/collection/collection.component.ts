import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Resource } from '../interfaces/resource.interface';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  tabName: string = '';
  resources: Resource[] = [];
  itemCount: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  nextPage: number | null = 2;

  constructor(private route: ActivatedRoute, private titleService: Title) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tabName = params.get('tabId') || 'Collection';
      this.titleService.setTitle(`${this.tabName} | Star Wars Explorer`);
    });
    this.route.data.subscribe(data => {
      const result = data['resources'];
  
      this.resources = result.resources;
      this.itemCount = result.count;
      this.currentPage = 1;
      this.totalPages = Math.ceil(result.count / 10);
      this.nextPage = this.currentPage < this.totalPages ? this.currentPage + 1 : null;
  
      console.log('Loaded resources:', this.resources);
      console.log(`Item count: ${this.itemCount}`);
      console.log(`Total pages: ${this.totalPages}`);
      console.log(`Next page: ${this.nextPage}`);
    });
  }
}
