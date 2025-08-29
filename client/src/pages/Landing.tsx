import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Landing() {
    return (
        <div className="min-h-screen bg-background">
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-[#1169fe]">Edgar Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/login">
                            <Button variant="outline">Login</Button>
                        </Link>
                        <Link to="/dashboard">
                            <Button>Dashboard</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <section className="pt-32 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                        All Your Data in One Place
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Discover insights from multiple data sources with our powerful dashboard.
                        Weather forecasts, tech news, and inspirational quotes - all at your fingertips.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/dashboard">
                            <Button size="lg" className="px-8">
                                Go to Dashboard
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button size="lg" variant="outline" className="px-8">
                                Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-muted/50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Powerful Features
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-card p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold mb-3">Weather Forecasts</h3>
                            <p className="text-muted-foreground">
                                Get accurate 7-day weather forecasts for any city in the world.
                                Plan your week with confidence.
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold mb-3">Tech News</h3>
                            <p className="text-muted-foreground">
                                Stay updated with the latest tech stories from Hacker News.
                                Filter by topics that interest you.
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold mb-3">Inspirational Quotes</h3>
                            <p className="text-muted-foreground">
                                Discover quotes from famous authors and thinkers.
                                Filter by tags to find the inspiration you need.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Ready to explore?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Jump into the dashboard and start exploring the data.
                        No sign-up required.
                    </p>
                    <Link to="/dashboard">
                        <Button size="lg" className="px-8">
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}