import { Outlet } from 'react-router-dom';
import { SidebarNav } from '@/components/organisms/SidebarNav';
import { TopBar } from '@/components/organisms/TopBar';
import { Toaster } from '@/components/ui/toaster';

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-background">
            <SidebarNav />

            <div className="md:pl-64">
                <TopBar />

                <main className="p-4 md:p-6">
                    <Outlet />
                </main>
            </div>

            <Toaster />
        </div>
    );
}
