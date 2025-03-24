import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgClass, NgIf } from '@angular/common';
import { StarWarsService } from './services/swapi-data.service';
import { Subject } from 'rxjs';
import { ScreenService } from './screen/screen.service';

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
  private destroy$: Subject<void> = new Subject<void>();
  constructor(private swService: StarWarsService, private screenService: ScreenService) {
    this.swService.tabsLoading$.subscribe((loading) => {
      if(loading === false) this.finishLoading();
    });
  }

  async ngOnInit(){
    this.screenService.trackBreakpoints(this.destroy$);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  finishLoading() {
    this.fadeOutLoader = true;
    setTimeout(() => {
      this.showLoader = false;
    }, 1000);
  }
}
