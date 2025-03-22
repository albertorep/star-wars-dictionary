import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  imports: [NgClass, RouterLink, ThemeToggleComponent, NgFor],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  tabInfo = [
    { name: 'Collection', data: 'collection' },
    { name: 'Favorites', data: 'favorites' },
    { name: 'Archives', data: 'archives' }
  ];

  currentTab: string = this.tabInfo[0].data;
  isMobile = false;
  logoPath: string = 'assets/icons/Star_Wars_Logo.svg';


  constructor(private router: Router) {}

  onTabIndexChanged(tab: any, index: number, event: Event): void {
    this.currentTab = tab.data;
    this.router.navigate(['/', tab.data]);
  }  
}
