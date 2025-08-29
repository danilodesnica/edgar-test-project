import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Search } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const weatherCodeMap: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Depositing rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Moderate drizzle', icon: '🌦️' },
  55: { label: 'Dense drizzle', icon: '🌧️' },
  61: { label: 'Slight rain', icon: '🌦️' },
  63: { label: 'Moderate rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  71: { label: 'Slight snow fall', icon: '🌨️' },
  73: { label: 'Moderate snow fall', icon: '🌨️' },
  75: { label: 'Heavy snow fall', icon: '❄️' },
  77: { label: 'Snow grains', icon: '❄️' },
  80: { label: 'Slight rain showers', icon: '🌦️' },
  81: { label: 'Moderate rain showers', icon: '🌧️' },
  82: { label: 'Violent rain showers', icon: '🌧️' },
  85: { label: 'Slight snow showers', icon: '🌨️' },
  86: { label: 'Heavy snow showers', icon: '❄️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { label: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

export default function Weather() {
  const [city, setCity] = useState('Belgrade');
  const [searchCity, setSearchCity] = useState('Belgrade');
  const { toast } = useToast();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['weather', city],
    queryFn: () => get<any>(`/api/weather?city=${city}`),
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Max Temperature (°C)',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Min Temperature (°C)',
        data: [],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  });

  useEffect(() => {
    if (data?.daily) {
      setChartData({
        labels: data.daily.map((day: any) => {
          const date = new Date(day.date);
          return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        }),
        datasets: [
          {
            label: 'Max Temperature (°C)',
            data: data.daily.map((day: any) => day.temperatureMax),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Min Temperature (°C)',
            data: data.daily.map((day: any) => day.temperatureMin),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      });
    }
  }, [data]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${city} 7-Day Forecast`,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
      },
    },
  };

  const handleSearch = () => {
    if (searchCity.trim()) {
      setCity(searchCity.trim());
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: 'Refreshed',
      description: `Weather data for ${city} has been refreshed`,
    });
  };

  const getWeatherDescription = (code: number) => {
    return weatherCodeMap[code] || { label: 'Unknown', icon: '❓' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Weather</h2>
        <p className="mb-4">Failed to load weather data. Please try again or check the city name.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Weather</h1>
        <Button onClick={handleRefresh} variant="outline" className="sm:self-end">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Enter city name"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button type="button" onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {data?.current && (
        <Card>
          <CardHeader>
            <CardTitle>Current Weather in {data.city}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <span className="text-5xl mr-4">
                  {getWeatherDescription(data.current.weathercode).icon}
                </span>
                <div>
                  <p className="text-3xl font-bold">{data.current.temperature}°C</p>
                  <p className="text-muted-foreground">
                    {getWeatherDescription(data.current.weathercode).label}
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <p>Wind: {data.current.windspeed} km/h</p>
                <p>Direction: {data.current.winddirection}°</p>
                <p>Updated: {new Date(data.current.time).toLocaleTimeString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Bar options={chartOptions} data={chartData} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.daily?.map((day: any) => (
          <Card key={day.date}>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="font-medium">{formatDate(day.date)}</p>
                <div className="my-2 text-4xl">
                  {getWeatherDescription(day.weathercode).icon}
                </div>
                <p className="text-sm">
                  {getWeatherDescription(day.weathercode).label}
                </p>
                <div className="mt-2 flex justify-between">
                  <span className="text-blue-500">{day.temperatureMin}°C</span>
                  <span className="text-red-500">{day.temperatureMax}°C</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
