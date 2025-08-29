# Edgar Dashboard

## What is Edgar Dashboard?

Edgar Dashboard is a full-stack web application that aggregates data from multiple public sources and presents it in interface. It serves as a personal dashboard for tracking quotes, tech news, and weather forecasts all in one place.

## Why This Data Matters

Edgar Dashboard brings together three types of valuable information:

1. Start your day with motivation and wisdom from famous authors and thinkers
2. Stay updated with the latest stories from Hacker News, filtered to your interests
3. Plan your week with accurate 7-day weather predictions for any city

## Who Is It For?

- Developers who want to stay informed about tech trends while getting inspired
- Knowledge workers looking for a simple dashboard to start their day
- Weather enthusiasts who want to track forecasts alongside other useful information

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Axios for external API requests
- Cheerio for web scraping
- Zod for validation
- Pino for logging

### Frontend
- React with Vite
- TypeScript
- React Router for navigation
- React Query for data fetching
- Tailwind CSS for styling
- shadcn/ui component library
- Chart.js for data visualization

## Architecture

Client (React) <-> Server (Express) <-> External APIs(quotes site, hacker news, open-meteo)

The application follows a clean architecture pattern:
- Client: Handles UI rendering, state management, and user interactions
- Server: Processes requests, aggregates data, and provides a clean API
- External Sources: Provide raw data that is processed and transformed by the server

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm 9+ installed

### Installation

1. Clone the repository and install dependencies:
   git clone <repository-url>
   cd edgar-dashboard
   npm run install:all

2. Set up environment variables:
   cp .env.example .env

3. Start the development server:
   npm run dev

4. Open your browser and navigate to:
   http://localhost:5173

## API Documentation

### Health Check

GET /api/health
Response: { ok: true, uptime: number }

### Quotes

GET /api/quotes?tag=love&limit=20&page=1
Response: { 
  success: true, 
  data: { 
    quotes: [{ text: string, author: string, tags: string[] }], 
    total: number, 
    page: number, 
    limit: number, 
    hasMore: boolean 
  } 
}

### News

GET /api/news/top?query=javascript&limit=20
Response: { 
  success: true, 
  data: { 
    items: [{ 
      id: number, 
      title: string, 
      url: string, 
      score: number, 
      by: string, 
      time: number, 
      descendants: number 
    }], 
    total: number 
  } 
}

### Weather

GET /api/weather?city=Belgrade
Response: { 
  success: true, 
  data: { 
    city: string, 
    latitude: number, 
    longitude: number, 
    current: { 
      temperature: number, 
      windspeed: number, 
      winddirection: number, 
      weathercode: number, 
      time: string 
    }, 
    daily: [{ 
      date: string, 
      temperatureMax: number, 
      temperatureMin: number, 
      weathercode: number 
    }] 
  } 
}