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
      <form (ngSubmit)="loadWeather()" class="search-form">
        <mat-form-field appearance="fill" class="city-input modern-input dark-input">
          <button mat-icon-button matPrefix color="primary" type="submit" aria-label="Suchen" class="search-icon-btn">
            <mat-icon>search</mat-icon>
          </button>
          <input matInput [(ngModel)]="currentCity" name="city" placeholder="Stadt, z.B. Berlin" autocomplete="off" autofocus (focus)="inputFocused=true" (blur)="inputFocused=false" >
          @if (currentCity) {
            <button matSuffix mat-icon-button aria-label="Eingabe löschen" type="button" (click)="currentCity=''" style="margin-right: 10px">
              <mat-icon>close</mat-icon>
            </button>
          }
        </mat-form-field>
      </form>

      @if (loading) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p class="loading-text">Wetterdaten werden geladen...</p>
        </div>
      } @else {
        <ng-container *ngIf="weatherData$ | async as weatherData">
          <app-weather-display [weatherData]="weatherData" [city]="searchedCity"></app-weather-display>
        </ng-container>
      }
    </div>

    <router-outlet />
  `,
  styles: [`
    .search-icon-btn {
      margin-left: 10px;
      margin-right: 10px;
    }

    .app-toolbar {
      box-shadow: 0 3px 5px -1px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12);
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
      color: rgba(0, 0, 0, .54);
    }

    .modern-search-card {
      background-color: red;
      border-radius: 8px;
      padding: 16px;
      color: white;
    }

    .search-form {
      display: flex;
      align-items: center;
    }

    .modern-input {
      flex: 1;
      margin-right: 8px;
      border: none;
      border-radius: 4px;
      color: white;
    }

    .dark-input {
      &::placeholder {
        color: rgba(142, 142, 142, 0.7);
      }
    }

    .search-hint {
      margin-top: 8px;
      font-size: 14px;
      color: rgba(28, 28, 28, 0.7);
    }

    .modern-search-btn {
      min-width: 64px;
      height: 36px;
      border-radius: 4px;
      text-transform: none;
    }
  `],
})
export class App implements OnInit {
  currentCity: string = "";
  protected title = 'SkyLine';
  loading = false;
  searchedCity: string = '';
  inputFocused: boolean = false;

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
      this.loading = true;
      this.searchedCity = this.currentCity;
      this.weatherService.fetchWeather(this.currentCity).then(() => {
        this.loading = false;
        console.log("Wetterdaten geladen");
      });
    }
  }
}
