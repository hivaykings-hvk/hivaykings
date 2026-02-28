import { Button } from '@/components/ui/button';
import RootLayout from '@/Layouts/RootLayout';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface VerifyEmailProps {
    token: string;
    error?: string;
    success?: boolean;
    verified?: boolean;
    expired?: boolean;
    alreadyVerified?: boolean;
}

export default function VerifyEmail({ token, error, success = false, verified = false, expired = false, alreadyVerified = false }: VerifyEmailProps) {
    const [countdown, setCountdown] = useState(10);

    // Auto-redirect on success
    useEffect(() => {
        if (success || verified || alreadyVerified) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        window.location.href = '/auth/signin';
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [success, verified, alreadyVerified]);

    return (
        <RootLayout>
            <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
                <div className="w-full max-w-md">
                    <div className="space-y-6 rounded-lg bg-white p-8 shadow-lg">
                        {/* Success State */}
                        {(success || verified || alreadyVerified) && (
                            <>
                                <div className="flex justify-center">
                                    <div className="rounded-full bg-green-100 p-4">
                                        <CheckCircle className="h-12 w-12 text-green-600" />
                                    </div>
                                </div>

                                <div className="space-y-2 text-center">
                                    <h1 className="text-2xl font-bold text-gray-900">Email Verified!</h1>
                                    <p className="text-gray-600">
                                        {alreadyVerified ? 'Your email is already verified.' : 'Your email has been successfully verified.'}
                                    </p>
                                </div>

                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <p className="text-sm text-blue-700">
                                        Redirecting you to login in <span className="font-bold">{countdown}</span> seconds...
                                    </p>
                                </div>

                                <Button
                                    onClick={() => (window.location.href = '/auth/signin')}
                                    className="w-full bg-green-600 text-white hover:bg-green-700"
                                >
                                    Go to Login Now
                                </Button>
                            </>
                        )}

                        {/* Error State - Expired Token */}
                        {expired && (
                            <>
                                <div className="flex justify-center">
                                    <div className="rounded-full bg-yellow-100 p-4">
                                        <AlertCircle className="h-12 w-12 text-yellow-600" />
                                    </div>
                                </div>

                                <div className="space-y-2 text-center">
                                    <h1 className="text-2xl font-bold text-gray-900">Token Expired</h1>
                                    <p className="text-gray-600">Your verification link has expired.</p>
                                </div>

                                <div className="space-y-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                    <p className="text-sm text-yellow-700">Please request a new verification link to continue.</p>
                                    <ResendVerificationForm />
                                </div>

                                <Button onClick={() => (window.location.href = '/auth/signin')} variant="outline" className="w-full">
                                    Back to Login
                                </Button>
                            </>
                        )}

                        {/* Error State - Invalid Token */}
                        {error && !expired && (
                            <>
                                <div className="flex justify-center">
                                    <div className="rounded-full bg-red-100 p-4">
                                        <AlertCircle className="h-12 w-12 text-red-600" />
                                    </div>
                                </div>

                                <div className="space-y-2 text-center">
                                    <h1 className="text-2xl font-bold text-gray-900">Verification Failed</h1>
                                    <p className="text-gray-600">{error}</p>
                                </div>

                                <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
                                    <p className="text-sm text-red-700">If you need a new verification link, please enter your email below.</p>
                                    <ResendVerificationForm />
                                </div>

                                <Button onClick={() => (window.location.href = '/auth/signin')} variant="outline" className="w-full">
                                    Back to Login
                                </Button>
                            </>
                        )}

                        {/* Loading State (shouldn't typically appear) */}
                        {!success && !verified && !error && !expired && !alreadyVerified && (
                            <>
                                <div className="flex justify-center">
                                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-600">Verifying your email...</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>
                            Need help?{' '}
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-700">
                                Contact support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}

function ResendVerificationForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleResend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/auth/resend-verification-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Verification email sent! Check your inbox.');
                setSent(true);
                setEmail('');

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    window.location.href = '/auth/signin';
                }, 3000);
            } else {
                toast.error(data.message || 'Failed to resend verification email');
            }
        } catch (err) {
            console.error('Failed to resend email:', err);
            toast.error('An error occurred while sending the email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="space-y-2 text-center">
                <p className="text-sm font-medium text-green-700">Verification email sent successfully! Redirecting to login in 3 seconds...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleResend} className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                />
                <Button type="submit" disabled={loading || !email} className="bg-blue-600 text-sm text-white hover:bg-blue-700">
                    {loading ? 'Sending...' : 'Resend'}
                </Button>
            </div>
        </form>
    );
}
