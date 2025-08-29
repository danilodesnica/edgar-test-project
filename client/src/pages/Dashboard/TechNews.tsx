import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/molecules/SearchBar';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, ExternalLink } from 'lucide-react';

interface NewsItem {
    id: number;
    title: string;
    url: string;
    score: number;
    by: string;
    time: number;
    descendants: number;
}

interface NewsResponse {
    items: NewsItem[];
    total: number;
}

export default function TechNews() {
    const [query, setQuery] = useState('');
    const { toast } = useToast();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['news', query],
        queryFn: () => get<NewsResponse>(`/api/news/top${query ? `?query=${query}` : ''}`),
    });

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
    };

    const handleRefresh = () => {
        refetch();
        toast({
            title: 'Refreshed',
            description: 'News stories have been refreshed',
        });
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
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
                <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading News</h2>
                <p className="mb-4">Failed to load news stories. Please try again.</p>
                <Button onClick={() => refetch()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold">Tech News</h1>
                <Button onClick={handleRefresh} variant="outline" className="sm:self-end">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
            </div>

            <div className="w-full max-w-md">
                <SearchBar
                    onSearch={handleSearch}
                    placeholder="Search stories..."
                    initialValue={query}
                />
            </div>

            <div className="space-y-4">
                {data?.items?.length === 0 ? (
                    <div className="text-center p-8 border rounded-lg">
                        <p className="text-muted-foreground">
                            {query
                                ? `No stories found matching "${query}". Try a different search term.`
                                : 'No stories found.'}
                        </p>
                    </div>
                ) : (
                    data?.items?.map((item: NewsItem) => (
                        <Card key={item.id}>
                            <CardContent className="p-6">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-xl font-semibold">{item.title}</h2>
                                    <div className="flex flex-wrap items-center gap-x-4 text-sm text-muted-foreground">
                                        <span>By: {item.by}</span>
                                        <span>Score: {item.score}</span>
                                        <span>Comments: {item.descendants}</span>
                                        <span>{formatDate(item.time)}</span>
                                    </div>
                                    <div className="mt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(item.url, '_blank')}
                                            disabled={!item.url}
                                        >
                                            Open Link
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}