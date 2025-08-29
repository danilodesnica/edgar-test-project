import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/atoms/Badge';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface Quote {
    text: string;
    author: string;
    tags: string[];
}

interface QuotesResponse {
    quotes: Quote[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

export default function Quotes() {
    const [page, setPage] = useState(1);
    const [tag, setTag] = useState<string | undefined>(undefined);
    const { toast } = useToast();

    const popularTags = ['love', 'inspirational', 'life', 'humor', 'books', 'reading', 'friendship', 'friends', 'truth', 'simile'];

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['quotes', page, tag],
        queryFn: () => get<QuotesResponse>(`/api/quotes?page=${page}&limit=10${tag ? `&tag=${tag}` : ''}`),
    });

    const handleTagClick = (selectedTag: string) => {
        setTag(tag === selectedTag ? undefined : selectedTag);
        setPage(1);
    };

    const handleRefresh = () => {
        refetch();
        toast({
            title: 'Refreshed',
            description: 'Quotes have been refreshed',
        });
    };

    const handlePrevPage = () => {
        setPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        if (data?.hasMore) {
            setPage((prev) => prev + 1);
        }
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
                <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Quotes</h2>
                <p className="mb-4">Failed to load quotes. Please try again.</p>
                <Button onClick={() => refetch()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold">Quotes</h1>
                <Button onClick={handleRefresh} variant="outline" className="sm:self-end">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
            </div>

            <div className="space-y-2">
                <h2 className="text-sm font-medium">Filter by tag:</h2>
                <div className="flex flex-wrap gap-2">
                    {popularTags.map((t) => (
                        <Badge
                            key={t}
                            variant={tag === t ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => handleTagClick(t)}
                        >
                            {t}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {data?.quotes?.length === 0 ? (
                    <div className="text-center p-8 border rounded-lg">
                        <p className="text-muted-foreground">No quotes found. Try a different tag or page.</p>
                    </div>
                ) : (
                    data?.quotes?.map((quote: Quote, index: number) => (
                        <Card key={`${quote.text.substring(0, 20)}-${index}`}>
                            <CardContent className="p-6">
                                <blockquote className="border-l-4 border-primary pl-4 italic">
                                    "{quote.text}"
                                </blockquote>
                                <div className="mt-4 flex justify-between items-center">
                                    <p className="font-medium">— {quote.author}</p>
                                    <div className="flex flex-wrap gap-2 justify-end">
                                        {quote.tags.map((t) => (
                                            <Badge key={t} variant="secondary" className="cursor-pointer" onClick={() => handleTagClick(t)}>
                                                {t}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div className="flex justify-between items-center">
                <Button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    variant="outline"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                </Button>
                <span>
                    Page {page}
                </span>
                <Button
                    onClick={handleNextPage}
                    disabled={!data?.hasMore}
                    variant="outline"
                >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}