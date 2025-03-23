import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Resource } from '../interfaces/resource.interface';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { StarWarsService } from '../services/swapi-data.service';
import { IconComponent } from '../icon/icon.component';
import { ExpandedCardComponent } from '../expanded-card/expanded-card.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  imports: [TitleCasePipe, CardComponent, NgFor, NgIf, IconComponent, ExpandedCardComponent],
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  tabName: string = '';
  resources: Resource[] = [];
  itemCount: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  nextPage: number | null = 2;
  isLoading: boolean = true;
  loadError: boolean = false;
  selectedResource: Resource | null = null;

  constructor(private route: ActivatedRoute, private titleService: Title, private starWarsService: StarWarsService,  private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }
    });
    this.route.paramMap.subscribe(params => {
      this.tabName = params.get('tabId') || 'Collection';
      this.titleService.setTitle(`${this.tabName} | Star Wars Explorer`);
    });
    this.route.data.subscribe(data => {
      const result = data['resources'];
  
      if (!result || !Array.isArray(result.resources) || result.resources.length === 0) {
        console.warn('No resources found or failed to load.');
        this.loadError = true;
        this.resources = [];
        return;
      }
      this.isLoading = false;
  
      this.loadError = false;
      this.resources = result.resources;
      this.itemCount = result.count;
      this.currentPage = 1;
      this.totalPages = Math.ceil(result.count / 10);
      this.nextPage = this.currentPage < this.totalPages ? this.currentPage + 1 : null;
    });
  }

  retryFetch() {
    if (!this.tabName) return;
  
    this.isLoading = true;
    this.loadError = false;
  
    this.starWarsService.getResources(this.tabName, 1).subscribe(result => {
      if (!result || result.resources.length === 0) {
        console.warn('Retry failed — no data received.');
        this.resources = [];
        this.loadError = true;
      } else {
        this.resources = result.resources;
        this.itemCount = result.count;
        this.totalPages = Math.ceil(result.count / 10);
        this.currentPage = 1;
        this.nextPage = this.currentPage < this.totalPages ? this.currentPage + 1 : null;
      }
  
      this.isLoading = false;
    });
  }

  onCardSelected(resource: Resource): void {
    this.selectedResource = resource;
  }
  
  closeExpandedCard(): void {
    this.selectedResource = null;
  }
}
