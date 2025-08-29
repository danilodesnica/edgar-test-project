export interface Quote {
    text: string;
    author: string;
    tags: string[];
}

export interface QuotesResponse {
    quotes: Quote[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

export interface NewsItem {
    id: number;
    title: string;
    url: string;
    score: number;
    by: string;
    time: number;
    descendants: number;
}

export interface NewsResponse {
    items: NewsItem[];
    total: number;
}

export interface WeatherCurrent {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
}

export interface WeatherDaily {
    date: string;
    temperatureMax: number;
    temperatureMin: number;
    weathercode: number;
}

export interface WeatherResponse {
    city: string;
    latitude: number;
    longitude: number;
    current: WeatherCurrent;
    daily: WeatherDaily[];
}

export interface GeocodingResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
}

export interface HealthResponse {
    ok: boolean;
    uptime: number;
    version: string;
    environment: string;
}
