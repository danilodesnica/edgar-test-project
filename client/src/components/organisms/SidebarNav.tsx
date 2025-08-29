import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Quote,
    Newspaper,
    Cloud,
    Menu,
    X,
    LogOut,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SidebarNavProps {
    className?: string;
}

export function SidebarNav({ className }: SidebarNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const navItems = [
        {
            name: 'Overview',
            path: '/dashboard/overview',
            icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
            name: 'Quotes',
            path: '/dashboard/quotes',
            icon: <Quote className="h-5 w-5" />,
        },
        {
            name: 'Tech News',
            path: '/dashboard/news',
            icon: <Newspaper className="h-5 w-5" />,
        },
        {
            name: 'Weather',
            path: '/dashboard/weather',
            icon: <Cloud className="h-5 w-5" />,
        },
    ];

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden fixed top-4 left-4 z-50"
                onClick={toggleSidebar}
            >
                {isOpen ? <X /> : <Menu />}
            </Button>

            <div
                className={cn(
                    'fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out',
                    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
                    className
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                        <h1 className="text-xl font-bold text-[#1169fe]">Edgar Dashboard</h1>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center px-4 py-2 rounded-md transition-colors',
                                        isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    )
                                }
                                onClick={() => setIsOpen(false)}
                            >
                                {item.icon}
                                <span className="ml-3">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t">
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={logout}
                        >
                            <LogOut className="h-5 w-5 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
