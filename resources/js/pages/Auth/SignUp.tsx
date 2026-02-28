'use client';

import ImagePickerAndPreview from '@/components/ImagePickerAndPreview';
import Link from '@/components/Link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxPopup } from '@/components/ui/combobox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import RootLayout from '@/layouts/RootLayout';
import { signupFormSchema, SignupFormSchema } from '@/types/auth-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { City, Country, State } from 'country-state-city';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import { FaCalendarDays, FaMapLocationDot, FaRegEye, FaRegEyeSlash, FaRoad, FaUserPlus, FaUsers } from 'react-icons/fa6';
import { toast } from 'sonner';

function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | undefined>();
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>('');

    const countries = useMemo(() => {
        const countryList = Country.getAllCountries().map((country) => ({
            label: country.name,
            value: country.isoCode,
        }));
        return [...countryList, { label: 'Other', value: 'OTHER' }];
    }, []);

    const states = useMemo(() => {
        if (!selectedCountry) return [];
        const stateList = State.getStatesOfCountry(selectedCountry).map((state) => ({
            label: state.name,
            value: state.isoCode,
        }));
        return [...stateList, { label: 'Other', value: 'OTHER' }];
    }, [selectedCountry]);

    const cities = useMemo(() => {
        if (!selectedCountry || !selectedState) return [];
        const cityList = City.getCitiesOfState(selectedCountry, selectedState).map((city) => ({
            label: city.name,
            value: city.name,
        }));
        return [...cityList, { label: 'Other', value: 'OTHER' }];
    }, [selectedCountry, selectedState]);

    const form = useForm<SignupFormSchema>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            title: '',
            username: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
            bio: '',
            agreeTerms: false,
            subscribeNewsletter: false,
        },
    });

    async function onSubmit(values: SignupFormSchema) {
        // Validate image before submission
        if (!selectedImage) {
            form.setError('image', {
                type: 'manual',
                message: 'Select your profile picture/avatar.',
            });
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('firstName', values.firstName);
            formData.append('lastName', values.lastName);
            formData.append('title', values.title || '');
            formData.append('username', values.username);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('password', values.password);
            formData.append('confirmPassword', values.confirmPassword);
            formData.append('city', values.city);
            formData.append('state', values.state);
            formData.append('country', values.country);
            formData.append('pincode', values.pincode);
            formData.append('bio', values.bio || '');
            formData.append('subscribeNewsletter', values.subscribeNewsletter ? '1' : '0');

            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const response = await axios.post('/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                // Show message about email verification
                if (response.data.requiresVerification) {
                    toast.success('Registration successful, please check your email for verification');
                    // Show verification pending page instead of redirecting
                    form.reset();
                    setSelectedImage(undefined);
                    // Stay on page or redirect to verification pending page
                    setTimeout(() => {
                        window.location.href = `/auth/signin?message=Please verify your email before logging in. Check your inbox for the verification link.`;
                    }, 2000);
                } else {
                    // For social login or other cases
                    toast.success('Account created successfully! Redirecting to sign in...');
                    form.reset();
                    setSelectedImage(undefined);
                    setTimeout(() => {
                        window.location.href = '/auth/signin?message=Registration successful. Please sign in with your credentials.';
                    }, 1500);
                }
            }
        } catch (error: any) {
            const errorData = error.response?.data;
            if (errorData?.errors) {
                for (const [key, messages] of Object.entries(errorData.errors)) {
                    form.setError(key as keyof SignupFormSchema, {
                        type: 'server',
                        message: Array.isArray(messages) ? messages[0] : String(messages),
                    });
                }
                toast.error('Please check the errors in the form.');
            } else {
                const message = errorData?.message || 'An unexpected error occurred.';
                form.setError('root', {
                    type: 'server',
                    message: message,
                });
                toast.error(message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-2xl space-y-8 rounded-xl bg-white px-6 py-10 shadow-2xl md:p-10">
                    {/* Header Section */}
                    <div className="text-center">
                        <div className="mb-4 flex items-center justify-center gap-2">
                            <FaRoad className="h-6 w-6 text-primary md:h-8 md:w-8" />
                            <h2 className="text-xl font-bold text-gray-900 md:text-3xl">Create Your Account</h2>
                        </div>
                        <p className="mt-2 text-center text-sm text-gray-600">Join thousands of road trip enthusiasts</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
                            {/* Image Preview and Upload */}
                            <FormField
                                control={form.control}
                                name="image"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <ImagePickerAndPreview
                                                value={selectedImage}
                                                onChange={(file) => {
                                                    setSelectedImage(file);
                                                    // Clear image error when image is selected
                                                    if (file) {
                                                        form.clearErrors('image');
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-center text-red-400" />
                                    </FormItem>
                                )}
                            />

                            {/* First Name & Last Name */}
                            <div className="mt-12 mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start md:gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your first name" autoComplete="given-name" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your last name" autoComplete="family-name" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex flex-col gap-8">
                                {/* Username */}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your username" autoComplete="username" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Email Address */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your email" autoComplete="email" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Phone Number */}
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your phone number" autoComplete="tel" type="tel" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Create a strong password"
                                                        autoComplete="new-password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        {...field}
                                                    />
                                                    <div
                                                        className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        <span className="text-gray-400">{showPassword ? <FaRegEyeSlash /> : <FaRegEye />}</span>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Confirm Password */}
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Confirm your password"
                                                        autoComplete="new-password"
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        {...field}
                                                    />
                                                    <div
                                                        className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        <span className="text-gray-400">
                                                            {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                                        </span>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Select Country */}
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Select Country</FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    items={countries}
                                                    onValueChange={(item) => {
                                                        field.onChange(item.value);
                                                        setSelectedCountry(item.value);
                                                        setSelectedState('');
                                                        form.setValue('state', '');
                                                        form.setValue('city', '');
                                                    }}
                                                >
                                                    <ComboboxInput aria-label="Select country" placeholder="Search country..." />
                                                    <ComboboxPopup>
                                                        <ComboboxEmpty>No country found.</ComboboxEmpty>
                                                        <ComboboxList>
                                                            {(item) => (
                                                                <ComboboxItem key={item.value} value={item}>
                                                                    {item.label}
                                                                </ComboboxItem>
                                                            )}
                                                        </ComboboxList>
                                                    </ComboboxPopup>
                                                </Combobox>
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Select State */}
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Select State</FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    items={states}
                                                    onValueChange={(item) => {
                                                        field.onChange(item.value);
                                                        setSelectedState(item.value);
                                                        form.setValue('city', '');
                                                    }}
                                                >
                                                    <ComboboxInput
                                                        aria-label="Select state"
                                                        placeholder="Search state..."
                                                        disabled={!selectedCountry}
                                                    />
                                                    <ComboboxPopup>
                                                        <ComboboxEmpty>No state found.</ComboboxEmpty>
                                                        <ComboboxList>
                                                            {(item) => (
                                                                <ComboboxItem key={item.value} value={item}>
                                                                    {item.label}
                                                                </ComboboxItem>
                                                            )}
                                                        </ComboboxList>
                                                    </ComboboxPopup>
                                                </Combobox>
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Select City */}
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Select City</FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    items={cities}
                                                    onValueChange={(item) => {
                                                        field.onChange(item.value);
                                                    }}
                                                >
                                                    <ComboboxInput aria-label="Select city" placeholder="Search city..." disabled={!selectedState} />
                                                    <ComboboxPopup>
                                                        <ComboboxEmpty>No city found.</ComboboxEmpty>
                                                        <ComboboxList>
                                                            {(item) => (
                                                                <ComboboxItem key={item.value} value={item}>
                                                                    {item.label}
                                                                </ComboboxItem>
                                                            )}
                                                        </ComboboxList>
                                                    </ComboboxPopup>
                                                </Combobox>
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Pincode */}
                                <FormField
                                    control={form.control}
                                    name="pincode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pincode</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your pincode" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Bio - About You */}
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>About You (Bio)</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    placeholder="Tell us something about yourself (optional)"
                                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {/* Checkboxes */}
                                <FormField
                                    control={form.control}
                                    name="agreeTerms"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="flex flex-col">
                                                <div className="inline-flex flex-grow leading-none">
                                                    <FormLabel className="flex flex-wrap text-sm font-normal">
                                                        I agree to the&nbsp;
                                                        <a href="#" className="text-primary hover:underline hover:underline-offset-4">
                                                            Terms of Service
                                                        </a>
                                                        &nbsp;and&nbsp;
                                                        <a href="#" className="text-primary hover:underline hover:underline-offset-4">
                                                            Privacy Policy
                                                        </a>
                                                    </FormLabel>
                                                </div>
                                                <FormMessage className="text-red-400" />
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="subscribeNewsletter"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="flex-grow space-y-1 leading-none">
                                                <FormLabel className="text-sm font-normal">
                                                    Subscribe to newsletter for road trip tips and community updates
                                                </FormLabel>
                                                <FormMessage className="text-red-400" />
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {/* Create My Account Button */}
                                <div>
                                    <Button
                                        type="submit"
                                        className="group relative flex w-full cursor-pointer items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-gray-800"
                                        disabled={loading}
                                    >
                                        <span className="flex items-center pl-3">
                                            <FaUserPlus className="h-5 w-5 text-gray-800" />
                                        </span>
                                        <span className="text-md ml-2 font-semibold">{loading ? 'Creating Account...' : 'Create My Account'}</span>
                                        <span className="flex items-center pl-3">
                                            {loading && <CgSpinner className="h-5 w-5 animate-spin text-gray-800" />}
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>

                    {/* Already have an account? Sign In */}
                    <div className="mt-6 text-center text-sm">
                        Already have an account?{' '}
                        <Link href="/auth/signin" className="font-medium text-primary hover:underline hover:underline-offset-4">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>

            {/* Why Join Section */}
            <div className="bg-gray-200 py-10">
                <div className="container mx-auto px-3">
                    <div className="pb-2 text-center text-xl font-bold text-gray-800">Why Join HVK?</div>
                    <p className="pb-8 text-center text-sm text-gray-500">{`"Become part of India's most trusted road trip community.`}</p>
                    <div className="flex w-full flex-col items-stretch justify-around gap-6 lg:flex-row">
                        <div className="flex flex-1 flex-col items-center gap-1 rounded-xl border border-none bg-white px-6 py-4">
                            <FaUsers className="h-8 w-8 text-primary" />
                            <div className="text-md text-center font-semibold text-gray-800">Connect with fellow Travelers</div>
                            <p className="text-center text-sm text-gray-500">Join the community of 50,000+ road trip enthusiasts</p>
                        </div>
                        <div className="flex flex-1 flex-col items-center gap-1 rounded-xl border border-none bg-white px-6 py-4">
                            <FaMapLocationDot className="h-8 w-8 text-primary" />
                            <div className="text-md text-center font-semibold text-gray-800">Expert Route Guidance</div>
                            <p className="text-center text-sm text-gray-500">Get insider tips and real-time conditions</p>
                        </div>
                        <div className="flex flex-1 flex-col items-center gap-1 rounded-xl border border-none bg-white px-6 py-4">
                            <FaCalendarDays className="h-8 w-8 text-primary" />
                            <div className="text-md text-center font-semibold text-gray-800">Exclusive Meetups</div>
                            <p className="text-center text-sm text-gray-500">Join organized trips and local gatherings</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

SignUpForm.layout = function (page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};

export default SignUpForm;
