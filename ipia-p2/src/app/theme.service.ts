import { Injectable, signal, effect } from '@angular/core';

export interface Theme {
  id: string;
  name: string;
  class: string;
  previewColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  
  readonly themes: Theme[] = [
    { id: 'default', name: 'Default', class: '', previewColor: '#0F4C75' },
    { id: 'dark', name: 'Dark', class: 'dark-theme', previewColor: '#1a1a2e' },
    { id: 'light', name: 'Light', class: 'light-theme', previewColor: '#f5f5f5' },
    { id: 'red', name: 'Red', class: 'red-theme', previewColor: '#D72631' },
    { id: 'green', name: 'Green', class: 'green-theme', previewColor: '#379683' },
    { id: 'pink', name: 'Pink', class: 'pink-theme', previewColor: '#e91e63' },
  ];

  currentTheme = signal<Theme>(this.themes[0]);

  constructor() {
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
  }

  setThemeById(themeId: string) {
    const theme = this.themes.find(theme => theme.id === themeId);
    if (theme) {
      this.currentTheme.set(theme);
    }
  }

  resetToDefault() {
    this.currentTheme.set(this.themes[0]);
  }

  private applyTheme(theme: Theme) {
    this.themes.forEach(theme => {
      if (theme.class) {
        document.body.classList.remove(theme.class);
      }
    });

    if (theme.class) {
      document.body.classList.add(theme.class);
    }
  }

  getThemeById(id: string): Theme | undefined {
    return this.themes.find(theme => theme.id === id);
  }
}
