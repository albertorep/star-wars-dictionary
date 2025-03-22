import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit {
  darkMode = false;

  ngOnInit() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'enabled') {
      this.darkMode = true;
      document.body.classList.add('dark-theme');
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('darkMode', 'disabled');
    }
  }
}
