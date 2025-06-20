import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { WeatherPoint } from './weather.service';

@Component({
  selector: 'app-weather-display',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule],
  template: `
    @if (weatherData && weatherData.length > 0) {
      <mat-card class="weather-card">
        <mat-card-header>
          <mat-card-title style="color: white; margin-bottom: 20px">
            <mat-icon>location_on</mat-icon>
            Wetterdaten für {{city}}
          </mat-card-title>
          <mat-card-subtitle style="margin-bottom: 10px">
            Die nächsten 24 Stunden
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <table class="weather-table">
            <thead>
              <tr>
                <th>Zeit</th>
                <th>Temperatur (°C)</th>
                <th>Niederschlag (mm)</th>
              </tr>
            </thead>
            <tbody>
              @for (point of weatherData.slice(0, 24); track point.time) {
                <tr>
                  <td>{{ point.time | date:'dd.MM. HH:mm' }}</td>
                  <td>
                    <span [ngClass]="{'warm': point.temperature > 20, 'cold': point.temperature < 10}">
                      {{ point.temperature.toFixed(1) }}
                    </span>
                  </td>
                  <td>
                    <span [ngClass]="{'rain': point.rain > 0.5}">
                      {{ point.rain.toFixed(1) }}
                      @if (point.rain > 0.5) {
                        <mat-icon class="rain-icon">water_drop</mat-icon>
                      }
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [`
    .weather-card {
      margin-top: 20px;
    }

    .weather-table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    th {
      color: #f2f2f2;
    }

    tr {
      color: #f9f9f9;
    }

    .warm {
      color: #ff6d00;
      font-weight: bold;
    }

    .cold {
      color: #2979ff;
      font-weight: bold;
    }

    .rain {
      color: #42a5f5;
      display: flex;
      align-items: center;
    }

    .rain-icon {
      font-size: 16px;
      height: 16px;
      width: 16px;
      margin-left: 4px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
    }

    mat-card-title mat-icon {
      margin-right: 8px;
    }
  `]
})
export class WeatherDisplayComponent {
  @Input() weatherData: WeatherPoint[] | null = null;
  @Input() city: string = '';
}
