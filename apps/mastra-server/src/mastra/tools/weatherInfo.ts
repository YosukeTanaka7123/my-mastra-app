import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
}

interface GeocodingResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
  local_names?: {
    ja?: string;
  };
}

class OpenWeatherApiClient {
  private baseUrl = "https://api.openweathermap.org";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherResponse> {
    const url = new URL(`${this.baseUrl}/data/2.5/weather`);
    url.searchParams.set("lat", lat.toString());
    url.searchParams.set("lon", lon.toString());
    url.searchParams.set("lang", "ja");
    url.searchParams.set("appid", this.apiKey);
    url.searchParams.set("units", "metric"); // 摂氏温度を使用

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Weather API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async getGeocoding(city: string): Promise<GeocodingResponse[]> {
    const url = new URL(`${this.baseUrl}/geo/1.0/direct`);
    url.searchParams.set("q", city);
    url.searchParams.set("limit", "1");
    url.searchParams.set("appid", this.apiKey);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Geocoding API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }
}

// 天気情報を取得するMastraツール
export const weatherInfo = createTool({
  id: "get-weather-info",
  description: "指定された都市の現在の天気情報を取得します",
  inputSchema: z.object({
    city: z.string().describe("天気情報を取得したい都市名"),
  }),
  outputSchema: z.object({
    city: z.string(),
    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    pressure: z.number(),
    conditions: z.string(),
    description: z.string(),
    windSpeed: z.number(),
    windDirection: z.number(),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  }),
  execute: async ({ context: { city } }) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENWEATHER_API_KEY environment variable is not set");
    }

    const client = new OpenWeatherApiClient(apiKey);

    try {
      // 1. 都市の座標を取得
      const geocodingResults = await client.getGeocoding(city);

      if (geocodingResults.length === 0) {
        throw new Error(`都市 '${city}' が見つかりませんでした`);
      }

      const location = geocodingResults[0];

      // 2. 座標を使って天気情報を取得
      const weatherData = await client.getCurrentWeather(
        location.lat,
        location.lon,
      );

      return {
        city: location.local_names?.ja || location.name,
        temperature: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        conditions: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
        windSpeed: weatherData.wind.speed,
        windDirection: weatherData.wind.deg,
        coordinates: {
          latitude: weatherData.coord.lat,
          longitude: weatherData.coord.lon,
        },
      };
    } catch (error) {
      console.error("Weather API error:", error);
      throw new Error(
        `天気情報の取得に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
      );
    }
  },
});
