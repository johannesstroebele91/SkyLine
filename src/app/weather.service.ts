import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { fetchWeatherApi } from 'openmeteo';

export interface WeatherPoint {
  time: Date;
  temperature: number;
  rain: number;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private weatherSub = new BehaviorSubject<WeatherPoint[] | null>(null);
  weather$ = this.weatherSub.asObservable();

  async fetchWeather(city: string) {
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
