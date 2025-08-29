import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api';
import { StatCard } from '@/components/molecules/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote, Newspaper, Cloud } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface QuotesResponse {
    quotes: Array<{
        text: string;
        author: string;
        tags: string[];
    }>;
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

interface NewsResponse {
    items: Array<{
        id: number;
        title: string;
        url: string;
        score: number;
        by: string;
        time: number;
        descendants: number;
    }>;
    total: number;
}

interface WeatherDailyData {
    date: string;
    temperatureMax: number;
    temperatureMin: number;
    weathercode: number;
}

interface WeatherResponse {
    city: string;
    latitude: number;
    longitude: number;
    current: {
        temperature: number;
        windspeed: number;
        winddirection: number;
        weathercode: number;
        time: string;
    };
    daily: WeatherDailyData[];
}

export default function Overview() {
    const quotesQuery = useQuery({
        queryKey: ['quotes', 'overview'],
        queryFn: () => get<QuotesResponse>('/api/quotes?limit=10'),
    });

    const newsQuery = useQuery({
        queryKey: ['news', 'overview', 'javascript'],
        queryFn: () => get<NewsResponse>('/api/news/top?query=javascript&limit=10'),
    });

    const weatherQuery = useQuery({
        queryKey: ['weather', 'overview', 'Belgrade'],
        queryFn: () => get<WeatherResponse>('/api/weather?city=Belgrade'),
    });

    const calculateAvgTemp = (): string => {
        if (!weatherQuery.data?.daily || weatherQuery.data.daily.length === 0) {
            return "N/A";
        }

        const sum = weatherQuery.data.daily.reduce(
            (acc, day) => acc + (day.temperatureMax + day.temperatureMin) / 2,
            0
        );

        const avg = sum / weatherQuery.data.daily.length;
        return `${avg.toFixed(1)}°C`;
    };

    const [chartData, setChartData] = useState({
        labels: [] as string[],
        datasets: [
            {
                label: 'Max Temperature (°C)',
                data: [] as number[],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Min Temperature (°C)',
                data: [] as number[],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    });

    useEffect(() => {
        if (weatherQuery.data?.daily) {
            setChartData({
                labels: weatherQuery.data.daily.map((day: WeatherDailyData) => {
                    const date = new Date(day.date);
                    return date.toLocaleDateString('en-US', { weekday: 'short' });
                }),
                datasets: [
                    {
                        label: 'Max Temperature (°C)',
                        data: weatherQuery.data.daily.map((day: WeatherDailyData) => day.temperatureMax),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                    {
                        label: 'Min Temperature (°C)',
                        data: weatherQuery.data.daily.map((day: WeatherDailyData) => day.temperatureMin),
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                ],
            });
        }
    }, [weatherQuery.data]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Belgrade 7-Day Forecast',
            },
        },
    };

    const isLoading =
        quotesQuery.isLoading || newsQuery.isLoading || weatherQuery.isLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Quotes"
                    value={quotesQuery.data?.quotes?.length || 0}
                    description="Inspirational quotes available"
                    icon={<Quote />}
                />
                <StatCard
                    title="JavaScript Stories"
                    value={newsQuery.data?.items?.length || 0}
                    description="Top HN stories about JavaScript"
                    icon={<Newspaper />}
                />
                <StatCard
                    title="Avg Temperature"
                    value={calculateAvgTemp()}
                    description="Next 7 days in Belgrade"
                    icon={<Cloud />}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Weather Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <Line options={chartOptions} data={chartData} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}