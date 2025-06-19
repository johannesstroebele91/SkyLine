import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './weather.service';
import { WeatherDisplayComponent } from './weather-display.component';

export interface WeatherPoint {
  time: Date;
  temperature: number;
  rain: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatToolbarModule, MatCardModule, MatProgressSpinnerModule,
            MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, WeatherDisplayComponent],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <span>{{title}}</span>
      <span class="toolbar-spacer"></span>
      <mat-icon aria-hidden="false" aria-label="Wetter Icon">wb_sunny</mat-icon>
    </mat-toolbar>

    <div class="content-container">
      <mat-card class="search-card">
        <mat-card-header>
          <mat-card-title style="color: white; margin-bottom: 20px">Wetter für deine Stadt</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" class="city-input">
            <mat-label>Stadt</mat-label>
            <input matInput [(ngModel)]="currentCity" placeholder="z.B. Stuttgart">
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="loadWeather()">
            <mat-icon>search</mat-icon>
            Wetter anzeigen
          </button>
        </mat-card-content>
      </mat-card>

      @if (weatherData$ | async; as weatherData) {
        <app-weather-display [weatherData]="weatherData" [city]="currentCity"></app-weather-display>
      } @else {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p class="loading-text">Wetterdaten werden geladen...</p>
        </div>
      }
    </div>

    <router-outlet />
  `,
  styles: [`
    .app-toolbar {
      box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
      margin-bottom: 20px;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .content-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .search-card {
      margin-bottom: 20px;
    }

    .city-input {
      width: 100%;
      max-width: 300px;
      margin-right: 16px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 50px;
    }

    .loading-text {
      margin-top: 20px;
      color: rgba(0,0,0,.54);
    }
  `],
})
export class App implements OnInit {
  currentCity: string = "";
  protected title = 'SkyLine';

  get weatherData$() {
    return this.weatherService.weather$;
  }

  constructor(private weatherService: WeatherService) {}

  async ngOnInit(): Promise<void> {
    console.log("hello");
    console.log("Stuttgart Wetterdaten abrufen...");
    this.currentCity = "Stuttgart";
    this.loadWeather();
  }

  loadWeather() {
    if (this.currentCity) {
      console.log(`Wetterdaten für ${this.currentCity} werden abgerufen...`);
      this.weatherService.fetchWeather(this.currentCity).then(() => {
        console.log("Wetterdaten geladen");
      });
    }
  }
}
