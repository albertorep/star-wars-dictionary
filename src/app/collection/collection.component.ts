import { Component, HostListener, Input, input, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Resource, ResourceType } from '../interfaces/resource.interface';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { filterableFieldsMap, StarWarsService } from '../services/swapi-data.service';
import { IconComponent } from '../icon/icon.component';
import { ExpandedCardComponent } from '../expanded-card/expanded-card.component';
import { FormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  imports: [TitleCasePipe, CardComponent, NgFor, NgIf, IconComponent, ExpandedCardComponent, FormsModule],
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
  scrollEnabled = true;
  pageFinished = false;
  selectedResource: Resource | null = null;
  filters: string[] = [];
  filterValues: Record<string, string> = {};
  filterSubjects: Record<string, Subject<string>> = {};
  skeletonCount = 5;
  showSkeletons = false;
  throwPage: boolean = false;
  skeletonArray = Array.from({ length: this.skeletonCount });
  paginationMode: 'scroll' | 'buttons' = 'scroll';


  constructor(private route: ActivatedRoute, private titleService: Title, private starWarsService: StarWarsService,  private router: Router) {}

  @HostListener('window:scroll')
  scrollHandler(): void {
    if (this.paginationMode !== 'scroll') return;
    const scrollThreshold = 200;
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const scrollSize = Math.round(scrollTop + window.innerHeight);
    if (
      scrollSize >= scrollHeight - scrollThreshold &&
      this.scrollEnabled &&
      !this.pageFinished &&
      this.nextPage
    ) {
      this.fetchPage(this.nextPage);
    }
  }

  get showPaginationButtons(): boolean {
    return this.paginationMode === 'buttons' && this.totalPages > 1;
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log("event", event);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Show loader
        this.isLoading = true;
        if(!this.scrollEnabled){
          this.throwPage = true;
        }
        this.resources = [];
        this.showSkeletons = true;
        this.filterValues = {};
        this.currentPage = 1;
        this.nextPage = null;
        this.pageFinished = false;
        this.loadError = false;
        this.tabName = event?.url?.split('/')[1] || '';
      }
    });
    this.route.paramMap.subscribe(params => {
      this.tabName = params.get('tabId') || 'Collection';
      this.initFilterSubjects();
      this.filters = filterableFieldsMap[this.tabName as ResourceType] || [];
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
      this.showSkeletons = false;
      this.itemCount = result.count;
      this.currentPage = 1;
      this.totalPages = Math.ceil(result.count / 10);
      this.nextPage = this.currentPage < this.totalPages ? this.currentPage + 1 : null;
      if(this.paginationMode === 'scroll') this.checkAndAutoFetchMore();
    });

    this.filters.forEach(filter => {
      this.filterSubjects[filter] = new Subject<string>();
    
      this.filterSubjects[filter]
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((searchValue) => {
            const trimmed = searchValue.trim();
            if (!trimmed) {
              this.fetchPage(1);
              return of([]); 
            }
            return this.starWarsService.filterResources(this.tabName, filter, trimmed);
          })
        )
        .subscribe((filteredResources) => {
          this.resources = filteredResources;
          this.itemCount = filteredResources.length;
          this.totalPages = Math.ceil(filteredResources.length / 10);
          this.currentPage = 1;
          this.nextPage = this.totalPages > 1 ? 2 : null;
          this.pageFinished = true;
        });
    });
    
  }

  onFilterChange(filter: string, value: string) {
    this.filterSubjects[filter].next(value);
  }

  initFilterSubjects(): void {
    this.filters = filterableFieldsMap[this.tabName as ResourceType] || [];
    this.filterValues = {};
    this.filterSubjects = {};
  
    this.filters.forEach(filter => {
      this.filterValues[filter] = '';
      this.filterSubjects[filter] = new Subject<string>();
  
      this.filterSubjects[filter]
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(value => {
            const trimmed = value.trim();
            if (!trimmed) {
              this.fetchPage(1);
              return of([]);
            }
            return this.starWarsService.filterResources(this.tabName, filter, trimmed);
          })
        )
        .subscribe(filteredResources => {
          this.resources = filteredResources;
          this.itemCount = filteredResources.length;
          this.totalPages = Math.ceil(filteredResources.length / 10);
          this.currentPage = 1;
          this.nextPage = this.totalPages > 1 ? 2 : null;
          this.pageFinished = true;
        });
    });
  }
  
  togglePaginationMode() {
    if(!this.scrollEnabled) return;
    if (this.paginationMode === 'scroll') {
      this.paginationMode = 'buttons';
      if(!this.scrollEnabled){
        this.throwPage = true;
      }
      this.skeletonCount = 10;
      this.skeletonArray = Array.from({ length: this.skeletonCount });
      this.currentPage = 1;
      this.totalPages = Math.ceil(this.itemCount / 10);
      this.nextPage = this.currentPage < this.totalPages ? this.currentPage + 1 : null;
      this.resources = this.resources.slice(0, 10);
    } else {
      this.paginationMode = 'scroll';
      this.skeletonCount = 5;
      this.skeletonArray = Array.from({ length: this.skeletonCount });
      if(this.currentPage !== 1){
        this.resources = [];
        this.scrollEnabled = false;
        this.showSkeletons = true;
        this.pageFinished = false;
        this.fetchPage(1, true);
      }
      else if(!this.pageFinished && this.nextPage){
        this.scrollEnabled = false;
        this.showSkeletons = true;
        this.fetchPage(this.nextPage);
      }
    }
  }
  
  
  goToNextPage() {
    if(!this.scrollEnabled) return;
    if (this.nextPage) {
      this.fetchPage(this.nextPage);
    }
  }
  
  goToPrevPage() {
    const prevPage = this.currentPage > 1 ? this.currentPage - 1 : 1;
    if(!this.scrollEnabled) return;
    if (prevPage !== this.currentPage) {
      this.fetchPage(prevPage);
    }
  }
  
  
  fetchPage(page: number, checkForAutoFetchMore?: boolean): void {
    if (!this.tabName) return;
  
    this.isLoading = true;
    this.loadError = false;
    this.scrollEnabled = false;
    this.showSkeletons = true;
    if(this.paginationMode === 'buttons'){
      this.resources = [];
      this.showSkeletons = true;
    }
    this.starWarsService.getResources(this.tabName, page).subscribe(result => {
      if(this.throwPage){
        this.scrollEnabled = true;
        this.throwPage = true;
        return;
      }
      if (!result || result.resources.length === 0) {
        if (page === 1) {
          this.resources = [];
          this.loadError = true;
        }
        this.pageFinished = true;
        this.isLoading = false;
        return;
      }

      this.itemCount = result.count;
      this.totalPages = Math.ceil(result.count / 10);
      this.currentPage = page;
      this.nextPage = this.currentPage < this.totalPages ? this.currentPage + 1 : null;
  
      if (this.paginationMode === 'scroll') {
        this.resources = [...this.resources, ...result.resources];
      } else {
        this.resources = result.resources;
      }
      this.showSkeletons = false;
      this.isLoading = false;
      this.scrollEnabled = true;
      if(page === 1 && this.paginationMode === 'scroll' && checkForAutoFetchMore){
        this.checkAndAutoFetchMore();
      }
    });
  }
  
  
  
  checkAndAutoFetchMore(): void {
    setTimeout(() => {
      const pageHeight = document.body.scrollHeight;
      const screenHeight = window.innerHeight;
  
      if (
        pageHeight < screenHeight &&
        !this.pageFinished &&
        this.scrollEnabled &&
        this.nextPage
      ) {
        this.fetchPage(this.nextPage);
      }
    }, 0);
  }

  onCardSelected(resource: Resource): void {
    this.selectedResource = resource;
  }
  
  closeExpandedCard(): void {
    this.selectedResource = null;
  }
}
