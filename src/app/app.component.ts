import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgClass, NgIf } from '@angular/common';
import { StarWarsService } from './services/swapi-data.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, NgIf, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'starWarsApp';
  showLoader = true;
  fadeOutLoader = false;

  constructor(private swService: StarWarsService) {
    this.swService.tabsLoading$.subscribe((loading) => {
      if(loading === false) this.finishLoading();
    });
  }

  finishLoading() {
    this.fadeOutLoader = true;
    setTimeout(() => {
      this.showLoader = false;
    }, 1000);
  }
}
