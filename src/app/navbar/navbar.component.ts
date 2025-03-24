import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { IconComponent } from '../icon/icon.component';
import { StarWarsService } from '../services/swapi-data.service';
import { Tab } from '../interfaces/tab.interface';
import { ScreenService } from '../screen/screen.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [NgClass, RouterLink, ThemeToggleComponent, NgFor, IconComponent, NgIf],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  tabInfo: Tab[] = [{ name: 'Home', path: '' }];
  currentTab: string = '';

  isMobileNav = false;
  isExpanded = false;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(private swService: StarWarsService, private router: Router, private screenService: ScreenService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.swService.getCategories().subscribe((tabs) => {
      this.tabInfo = [{ name: 'Home', path: '' }, ...tabs];
      if (!this.currentTab) {
        this.currentTab = this.tabInfo[0].path;
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        const path = url.split('/')[1];
        const matchingTab = this.tabInfo.find(tab => tab.path === path);
        this.currentTab = matchingTab ? matchingTab.path : '';
      }
    });

    this.screenService.screenSize(this.destroy$).subscribe((isMobile) => {
      console.log("isMobile", isMobile);
      this.isMobileNav = isMobile;
    });
  }

  toggleNav(): void {
    console.log("toggleNav");
    this.isExpanded = !this.isExpanded;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.navbar');
    if (!clickedInside && this.isMobileNav && this.isExpanded) {
      this.isExpanded = false;
    }
  }

  onTabIndexChanged(tab: any): void {
    this.currentTab = tab.path;
    this.router.navigate([tab.path || '']);
    //if (this.isMobileNav) this.isExpanded = false;
  }
}

