'use client'
import { useState } from 'react';
import { Eye, EyeOff, Car, Facebook, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { login, signup } from '@/api/users'; // Adjust the import path as needed
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import the styles
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter()
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loginEmail, setLoginEmail] = useState<string>('');
    const [loginPassword, setLoginPassword] = useState<string>('');
    const [signupName, setSignupName] = useState<string>('');
    const [signupEmail, setSignupEmail] = useState<string>('');
    const [signupPassword, setSignupPassword] = useState<string>('');
    const [signupPhoneNumber, setSignupPhoneNumber] = useState<string>(''); // Phone number with country code
    const [error, setError] = useState<string>('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
             await login(loginEmail, loginPassword);
            router.push('/dashboard');
        } catch (err:any) {
            setError(err.message || 'Login failed. Please try again.');
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
          await signup(
                signupName,
                signupEmail,
                signupPassword,
                signupPhoneNumber
            );
            router.push('/dashboard');
        } catch (err:any) {
            setError(err.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center">
                        <Car className="h-8 w-8 text-blue-500" />
                        <CardTitle className="text-2xl font-bold ml-2">RideNow</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-2 bg-red-100 text-red-600 text-sm rounded">
                            {error}
                        </div>
                    )}
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <form onSubmit={handleLogin}>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="login-email">Email</Label>
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="m@example.com"
                                            value={loginEmail}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setLoginEmail(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="login-password">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="login-password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={loginPassword}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setLoginPassword(e.target.value)
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <Button className="w-full" type="submit">
                                        Login
                                    </Button>
                                </div>
                            </form>
                            <div className="mt-4 text-center">
                                <a href="#" className="text-sm text-blue-500 hover:underline">
                                    Forgot your password?
                                </a>
                            </div>
                        </TabsContent>
                        <TabsContent value="signup">
                            <form onSubmit={handleSignup}>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="signup-name">Full Name</Label>
                                        <Input
                                            id="signup-name"
                                            type="text"
                                            placeholder="John Doe"
                                            value={signupName}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setSignupName(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="signup-email">Email</Label>
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="m@example.com"
                                            value={signupEmail}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setSignupEmail(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="signup-phone">Phone Number</Label>
                                      <PhoneInput
                                        id="signup-phone"
                                        international
                                        defaultCountry="IN" // Default country code (e.g., India)
                                        value={signupPhoneNumber}
                                        onChange={(value) => setSignupPhoneNumber(value || '')}
                                        placeholder="+91 1234567890"
                                        className="react-phone-input w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" // Add custom styles for better visibility
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="signup-password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={signupPassword}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setSignupPassword(e.target.value)
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <Button className="w-full" type="submit">
                                        Sign Up
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full">
                            <Facebook className="mr-2 h-4 w-4" />
                            Facebook
                        </Button>
                        <Button variant="outline" className="w-full">
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}