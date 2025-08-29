import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    initialValue?: string;
    debounceMs?: number;
}

export function SearchBar({
    onSearch,
    placeholder = 'Search...',
    initialValue = '',
    debounceMs = 300,
}: SearchBarProps) {
    const [value, setValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(initialValue);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), debounceMs);
        return () => clearTimeout(timer);
    }, [value, debounceMs]);

    useEffect(() => {
        if (debouncedValue !== initialValue) {
            onSearch(debouncedValue);
        }
    }, [debouncedValue, onSearch, initialValue]);

    const handleSearchClick = useCallback(() => {
        onSearch(value);
    }, [value, onSearch]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                onSearch(value);
            }
        },
        [value, onSearch]
    );

    return (
        <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="flex-1"
            />
            <Button type="button" onClick={handleSearchClick} size="icon">
                <Search className="h-4 w-4" />
            </Button>
        </div>
    );
}
