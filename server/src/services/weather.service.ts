import { http } from '../utils/http';

import logger from '../config/logger';
import { WeatherResponse, GeocodingResult } from '../types';
import { WeatherQuery } from '../schemas/common.schema';
import { ApiError } from '../middlewares/error.middleware';

const WEATHER_API_BASE = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

export class WeatherService {
    async getWeather(params: WeatherQuery): Promise<WeatherResponse> {
        const { city } = params;

        try {
            const location = await this.geocodeCity(city);

            if (!location) {
                throw new ApiError(`City not found: ${city}`, 404);
            }

            // Fetch weather data
            logger.info(`Fetching weather for ${city} (${location.latitude}, ${location.longitude})`);

            const response = await http.get(WEATHER_API_BASE, {
                params: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    current: 'temperature_2m,windspeed_10m,winddirection_10m,weathercode',
                    daily: 'weathercode,temperature_2m_max,temperature_2m_min',
                    timezone: 'auto',
                    forecast_days: 7,
                },
            });

            const data = response.data;

            if (!data) {
                throw new ApiError('No weather data found', 404);
            }

            // Transform the data to our format
            const result: WeatherResponse = {
                city: location.name,
                latitude: location.latitude,
                longitude: location.longitude,
                current: {
                    temperature: data.current.temperature_2m,
                    windspeed: data.current.windspeed_10m,
                    winddirection: data.current.winddirection_10m,
                    weathercode: data.current.weathercode,
                    time: data.current.time,
                },
                daily: data.daily.time.map((date: string, index: number) => ({
                    date,
                    temperatureMax: data.daily.temperature_2m_max[index],
                    temperatureMin: data.daily.temperature_2m_min[index],
                    weathercode: data.daily.weathercode[index],
                })),
            };

            return result;
        } catch (error) {
            logger.error('Error fetching weather:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to fetch weather data', 500);
        }
    }

    private async geocodeCity(city: string): Promise<GeocodingResult> {
        try {
            logger.info(`Geocoding city: ${city}`);

            const response = await http.get(GEOCODING_API_BASE, {
                params: {
                    name: city,
                    count: 1,
                    language: 'en',
                    format: 'json',
                },
            });

            const results = response.data.results;

            if (!results || !results.length) {
                throw new ApiError(`City not found: ${city}`, 404);
            }

            const location = results[0];

            return location;
        } catch (error) {
            logger.error(`Error geocoding city ${city}:`, error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(`Failed to geocode city: ${city}`, 500);
        }
    }
}

export default new WeatherService();
