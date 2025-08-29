import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function TopBar() {
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="border-b bg-background">
            <div className="flex h-16 items-center px-4 md:px-6">
                <div className="ml-auto flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="font-medium">
                            {user?.name || 'Guest'}
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                            {user?.name?.charAt(0).toUpperCase() || 'G'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}