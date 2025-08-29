import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast({
                title: 'Error',
                description: 'Please enter both email and password',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            const success = await login(email, password);

            if (success) {
                navigate(from);
            } else {
                toast({
                    title: 'Error',
                    description: 'Invalid email or password',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An error occurred during login',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-background">
            <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1470&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="h-full w-full bg-black/30 p-8 flex flex-col justify-end">
                    <h2 className="text-white text-3xl font-bold mb-4">Edgar Dashboard</h2>
                    <p className="text-white/80 text-lg">
                        Access your personalized dashboard with quotes, news, and weather in one place.
                    </p>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Login</CardTitle>
                        <CardDescription>
                            Enter your credentials to access the dashboard
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="text-sm text-muted-foreground">
                                This is a demo app. Any email and password will work.
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                            <div className="text-center text-sm">
                                <Link to="/" className="text-primary hover:underline">
                                    Back to home
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}