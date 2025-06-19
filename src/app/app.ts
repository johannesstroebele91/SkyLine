import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fetchWeatherApi } from 'openmeteo';
import { CommonModule } from '@angular/common';

export interface WeatherPoint {
  time: Date;
  temperature: number;
  rain: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  template: `
    <h1>Welcome to {{title}}!</h1>

    <div *ngIf="weather$ | async as weatherData; else loading">
      <h2>Wetterdaten für Stuttgart</h2>

      <div class="weather-container">
        <table>
          <thead>
            <tr>
              <th>Zeit</th>
              <th>Temperatur (°C)</th>
              <th>Niederschlag (mm)</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let point of weatherData.slice(0, 24)">
              <td>{{ point.time | date:'dd.MM. HH:mm' }}</td>
              <td>{{ point.temperature.toFixed(1) }}</td>
              <td>{{ point.rain.toFixed(1) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ng-template #loading>
      <p>Wetterdaten werden geladen...</p>
    </ng-template>

    <router-outlet />
  `,
  styles: [`
    .weather-container {
      margin-top: 20px;
      overflow-x: auto;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      max-width: 600px;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
  `],
})
export class App implements OnInit {
  async ngOnInit(): Promise<void> {
    console.log("hello")
    console.log("Stuttgart Wetterdaten abrufen...");
    this.fetch("Stuttgart").then(() => console.log("Wetterdaten geladen"));
  }
  protected title = 'SkyLine';

  private weatherSub = new BehaviorSubject<WeatherPoint[] | null>(null);
  weather$ = this.weatherSub.asObservable();

  async fetch(city: string) {
    // 1) Stadt → Koordinaten
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
      .then(r => r.json());
    if (!geoRes.results?.length) return;
    const {latitude, longitude} = geoRes.results[0];

    // 2) Wetterdaten via SDK
    const params = {
      latitude,
      longitude,
      hourly: ["temperature_2m", "rain"],
      timezone: "Europe/Berlin"
    } as const;
    const url = "https://api.open-meteo.com/v1/forecast";
    const [response] = await fetchWeatherApi(url, params);

    const offset = response.utcOffsetSeconds();
    const hourly = response.hourly()!;
    const points: WeatherPoint[] = [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())]
      .map((_, i) => ({
        time: new Date((Number(hourly.time()) + i * hourly.interval() + offset) * 1000),
        temperature: hourly.variables(0)!.valuesArray()![i],
        rain: hourly.variables(1)!.valuesArray()![i]
      }));

    this.weatherSub.next(points);
  }
}
