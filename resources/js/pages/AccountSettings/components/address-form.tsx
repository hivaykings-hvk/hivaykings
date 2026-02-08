'use client';
import { Button } from '@/Components/ui/button';
import { Combobox, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxPopup } from '@/Components/ui/combobox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { City, Country, State } from 'country-state-city';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import { FiMapPin, FiSave } from 'react-icons/fi';
import { toast } from 'sonner';
import { z } from 'zod';
interface AddressMutationContext {
    previousUser: any;
}
const addressSchema = z.object({
    city: z.string().optional().or(z.literal('')),
    state: z.string().optional().or(z.literal('')),
    country: z.string().optional().or(z.literal('')),
    pincode: z.string().optional().or(z.literal('')),
});
type AddressFormData = z.infer<typeof addressSchema>;
interface AddressFormProps {
    user: any;
}
export function AddressForm({ user }: AddressFormProps) {
    const queryClient = useQueryClient();
    const [selectedCountry, setSelectedCountry] = React.useState<string>(user?.country || '');
    const [selectedState, setSelectedState] = React.useState<string>(user?.state || '');
    const [selectedCity, setSelectedCity] = React.useState<string>(user?.city || '');
    const [countryInput, setCountryInput] = React.useState<string>('');
    const [stateInput, setStateInput] = React.useState<string>('');
    const [cityInput, setCityInput] = React.useState<string>('');

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

    // Get labels for display
    const selectedCountryLabel = useMemo(() => {
        return countries.find((c) => c.value === selectedCountry)?.label || '';
    }, [countries, selectedCountry]);

    const selectedStateLabel = useMemo(() => {
        return states.find((s) => s.value === selectedState)?.label || '';
    }, [states, selectedState]);

    const selectedCityLabel = useMemo(() => {
        return cities.find((c) => c.value === selectedCity)?.label || '';
    }, [cities, selectedCity]);

    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: { city: user?.city || '', state: user?.state || '', country: user?.country || '', pincode: user?.pincode || '' },
    });

    React.useEffect(() => {
        if (user?.country) {
            setSelectedCountry(user.country);
        }
        if (user?.state) {
            setSelectedState(user.state);
        }
        if (user?.city) {
            setSelectedCity(user.city);
        }
        form.reset({ city: user?.city || '', state: user?.state || '', country: user?.country || '', pincode: user?.pincode || '' });
    }, [user?.country, user?.state, user?.city, user?.pincode, form]);
    const updateAddressMutation = useMutation<any, Error, AddressFormData, AddressMutationContext>({
        mutationFn: async (data) => {
            const response = await axios.put('/api/user/profile', {
                city: data.city || undefined,
                state: data.state || undefined,
                country: data.country || undefined,
                pincode: data.pincode || undefined,
            });
            return response.data;
        },
        onMutate: async (newData) => {
            await queryClient.cancelQueries({ queryKey: ['user'] });
            const previousUser = queryClient.getQueryData(['user']);
            queryClient.setQueryData(['user'], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    ...newData,
                    city: newData.city || old.city,
                    state: newData.state || old.state,
                    country: newData.country || old.country,
                    pincode: newData.pincode || old.pincode,
                };
            });
            return { previousUser };
        },
        onError: (err, newData, context) => {
            toast.error('Failed to update address');
            if (context?.previousUser) {
                queryClient.setQueryData(['user'], context.previousUser);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('Address updated successfully!');
        },
    });
    const onSubmit = (data: AddressFormData) => {
        updateAddressMutation.mutate(data);
    };
    return (
        <Form {...form}>
            {' '}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {' '}
                <div>
                    {' '}
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                        {' '}
                        <FiMapPin className="h-5 w-5 text-emerald-500" /> Address Information{' '}
                    </h3>{' '}
                    <p className="mb-6 text-sm text-slate-600 dark:text-slate-400"> Update your address and location details </p>{' '}
                </div>{' '}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Country */}
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
                                            setCountryInput(item.label);
                                            setSelectedState('');
                                            setSelectedCity('');
                                            setStateInput('');
                                            setCityInput('');
                                            form.setValue('state', '');
                                            form.setValue('city', '');
                                        }}
                                    >
                                        <ComboboxInput
                                            aria-label="Select country"
                                            placeholder="Search country..."
                                            value={countryInput || selectedCountryLabel}
                                            onChange={(e) => setCountryInput(e.target.value)}
                                            onBlur={() => {
                                                if (!countryInput && selectedCountry) {
                                                    setCountryInput(selectedCountryLabel);
                                                }
                                            }}
                                        />
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

                    {/* State */}
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
                                            setStateInput(item.label);
                                            setSelectedCity('');
                                            setCityInput('');
                                            form.setValue('city', '');
                                        }}
                                    >
                                        <ComboboxInput
                                            aria-label="Select state"
                                            placeholder="Search state..."
                                            disabled={!selectedCountry}
                                            value={stateInput || selectedStateLabel}
                                            onChange={(e) => setStateInput(e.target.value)}
                                            onBlur={() => {
                                                if (!stateInput && selectedState) {
                                                    setStateInput(selectedStateLabel);
                                                }
                                            }}
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

                    {/* City */}
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
                                            setSelectedCity(item.value);
                                            setCityInput(item.label);
                                        }}
                                    >
                                        <ComboboxInput
                                            aria-label="Select city"
                                            placeholder="Search city..."
                                            disabled={!selectedState}
                                            value={cityInput || selectedCityLabel}
                                            onChange={(e) => setCityInput(e.target.value)}
                                            onBlur={() => {
                                                if (!cityInput && selectedCity) {
                                                    setCityInput(selectedCityLabel);
                                                }
                                            }}
                                        />
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
                                <FormLabel>Postal / Zip Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="10001" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={!form.formState.isDirty || updateAddressMutation.isPending}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-gray-800 transition-colors disabled:cursor-not-allowed disabled:bg-primary/50"
                    >
                        <FiSave className="h-4 w-4" />
                        {updateAddressMutation.isPending ? 'Saving...' : 'Save Changes'}
                        {updateAddressMutation.isPending && <CgSpinner className="ml-2 h-5 w-5 animate-spin text-gray-800" />}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
