import { NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { IconComponent } from '../icon/icon.component';
import { StarWarsService } from '../services/swapi-data.service';

@Component({
  selector: 'app-navbar',
  imports: [NgClass, RouterLink, ThemeToggleComponent, NgFor, IconComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  tabInfo: { name: string, path: string }[] = [];
  currentTab: string = '';

  constructor(private swService: StarWarsService, private router: Router) {}

  ngOnInit(): void {
    this.swService.getCategories().subscribe((tabs) => {
      this.tabInfo = tabs;
      if (tabs.length && !this.currentTab) {
        this.currentTab = tabs[0].path;
      }
    });
  }

  onTabIndexChanged(tab: any): void {
    this.currentTab = tab.path;
    this.router.navigate(['/', tab.path]);
  }
}
