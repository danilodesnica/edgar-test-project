import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import DashboardLayout from '@/pages/Dashboard/Layout';
import Overview from '@/pages/Dashboard/Overview';
import Quotes from '@/pages/Dashboard/Quotes';
import TechNews from '@/pages/Dashboard/TechNews';
import Weather from '@/pages/Dashboard/Weather';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Landing />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/dashboard',
        element: <ProtectedRoute />,
        children: [
            {
                path: '',
                element: <DashboardLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/dashboard/overview" replace />,
                    },
                    {
                        path: 'overview',
                        element: <Overview />,
                    },
                    {
                        path: 'quotes',
                        element: <Quotes />,
                    },
                    {
                        path: 'news',
                        element: <TechNews />,
                    },
                    {
                        path: 'weather',
                        element: <Weather />,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);

export default router;
