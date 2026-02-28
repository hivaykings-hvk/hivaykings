'use client';

import appImage from '@/assets/images/store-images/app-image.png';
import chaloLadakh from '@/assets/images/store-images/package/chalo-ladakh.png';
import chaloNorthEast from '@/assets/images/store-images/package/chalo-north-east.png';
import monsoonDrive from '@/assets/images/store-images/package/monsoon-drive.png';
import hvkDecal from '@/assets/images/store-images/product/hvk-decal.png';
import hvkMaps from '@/assets/images/store-images/product/hvk-maps.png';
import hvkMug from '@/assets/images/store-images/product/hvk-mug.png';
import hvkTshirt from '@/assets/images/store-images/product/hvk-tshirt.png';
import storeHero from '@/assets/images/store-images/store-hero.png';
import RootLayout from '@/layouts/RootLayout';
import {
    FaCalendarCheck,
    FaCloudRain,
    FaCrown,
    FaDownload,
    FaHeadset,
    FaHeart,
    FaMedal,
    FaMountain,
    FaShieldAlt,
    FaTree,
    FaTruck,
} from 'react-icons/fa';

const hvkProducts = [
    {
        image: hvkTshirt,
        title: 'HVK Brotherhood T-Shirt',
        description: 'Premium cotton tee with HVK road-trip slogans',
        price: '499',
    },
    {
        image: hvkDecal,
        title: 'HVK Car Decal Pack',
        description: 'Waterproof stickers for cars, highways, milestones',
        price: '199',
    },
    {
        image: hvkMug,
        title: 'Highway Coffee Mug',
        description: 'Start your journey with the perfect brew',
        price: '299',
    },
    {
        image: hvkMaps,
        title: 'HVK Printed Maps',
        description: 'Detailed highway maps with HVK insights',
        price: '399',
    },
];

const chaloPackages = [
    {
        icon: FaMountain,
        title: 'ChalO Ladakh',
        description: "14 days of Himalayan adventure, curated routes, and HVK road safety notes. Conquer the world's highest motorable passes.",
        price: '85,000',
        image: chaloLadakh,
        iconColor: 'text-yellow-500',
    },
    {
        icon: FaTree,
        title: 'ChalO North East',
        description: "7 state circuit with HVK guidance, road conditions updated live. Explore hidden gems of India's Northeast.",
        price: '65,000',
        image: chaloNorthEast,
        iconColor: 'text-green-500',
    },
    {
        icon: FaCloudRain,
        title: 'Monsoon Drive Circuits',
        description: "Western Ghats & Konkan in monsoon magic. Experience the lush beauty of India's coastal ranges.",
        price: '45,000',
        image: monsoonDrive,
        iconColor: 'text-blue-500',
    },
];

const StorePage = () => {
    return (
        <RootLayout>
            <>
                {/* Hero Section */}
                <div className="bg-zinc-800 bg-cover bg-center text-white bg-blend-overlay" style={{ backgroundImage: `url(${storeHero})` }}>
                    <div className="container mx-auto">
                        <div className="mx-4 flex flex-col-reverse items-center gap-8 lg:flex-row">
                            <div className="flex-1 text-3xl font-bold lg:py-20">
                                <h1 className="text-5xl font-normal text-gray-200">
                                    HVK <span className="text-primary">RoutO</span> – Your Offline
                                    <br />
                                    Highway GPS
                                </h1>
                                <p className="mt-8 text-base font-normal text-gray-300">
                                    Unlike regular apps, RoutO works deep inside India's highways, <br />
                                    tailored with HVK's 40+ years of road knowledge.
                                </p>
                                <p className="mt-8 text-sm font-normal text-primary">When you travel, we travel with you</p>
                                <div className="mt-8 flex flex-col gap-3 pb-8 md:flex-row">
                                    <button className="hover:bg-primary-dark flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-normal text-neutral-800 shadow-lg transition-colors">
                                        <FaDownload className="h-3 w-3" />
                                        Download Now
                                    </button>
                                    <button className="rounded-md border border-primary px-6 py-3 text-sm font-normal text-primary shadow-lg transition-colors hover:bg-primary hover:text-neutral-800">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 py-8 text-center text-lg text-gray-400 lg:w-fit lg:px-24">
                                <img src={appImage} alt="HVK RoutO App" className="w-full rounded-xl lg:w-4/5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ChalO Series - Curated Road-Trip Packages */}
                <div className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-center text-3xl font-medium text-gray-800">ChalO Series – Curated Road-Trip Packages</h2>
                        <p className="text-md mt-4 mb-12 text-center text-gray-600">
                            Experience India's most spectacular routes with HVK's expert guidance and community support
                        </p>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {chaloPackages.map((pkg, index) => {
                                const Icon = pkg.icon;
                                return (
                                    <div key={index} className="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg">
                                        <div className="h-60 w-full overflow-hidden">
                                            <img src={pkg.image} alt={pkg.title} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex flex-grow flex-col p-6">
                                            <div className="mb-2 flex items-center text-lg font-semibold text-gray-800">
                                                <Icon className={`mr-2 h-5 w-5 ${pkg.iconColor}`} />
                                                {pkg.title}
                                            </div>
                                            <p className="flex-grow text-sm text-gray-600">{pkg.description}</p>
                                            <div className="mt-auto flex items-baseline justify-between">
                                                <span className="text-2xl font-medium text-primary">₹{pkg.price}</span>
                                                <span className="text-sm text-gray-500">per person</span>
                                            </div>
                                            <button className="hover:bg-primary-dark mt-6 w-full rounded-lg bg-primary py-5 font-medium text-gray-800 transition-colors">
                                                Booking Starting Soon
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* HVK Merchandise */}
                <div className="bg-gray-100 py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-center text-3xl font-medium text-gray-800">HVK Merchandise</h2>
                        <p className="mt-4 mb-12 text-center text-lg text-gray-600">Show your HVK pride with our exclusive road-trip merchandise</p>

                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {hvkProducts.map((product, index) => (
                                <div key={index} className="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg">
                                    <div className="h-60 w-full overflow-hidden">
                                        <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex flex-grow flex-col p-4">
                                        <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                                        <p className="mt-2 flex-grow text-sm text-gray-600">{product.description}</p>
                                        <div className="my-3 flex items-center justify-between">
                                            <span className="text-xl font-medium text-primary">₹{product.price}</span>
                                            <button className="rounded-md bg-neutral-800 px-3 py-2 text-sm text-white transition-colors hover:bg-neutral-700">
                                                Coming Soon
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Club 12 - Exclusive HVK Membership */}
                <div className="bg-bgNavBarBlack py-16">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-4xl rounded-xl bg-primary p-8 text-center shadow-lg">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800">
                                <FaCrown className="text-center text-2xl text-primary" />
                            </div>
                            <h2 className="mb-4 text-4xl font-medium text-gray-800">Club 12 – Exclusive HVK Membership</h2>
                            <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-700">
                                Join HVK's inner circle for priority route support, early access to trips, exclusive community badges, and direct
                                access to HV Kumar's expertise.
                            </p>

                            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="rounded-lg bg-yellow-50/20 p-6">
                                    <FaHeadset className="mx-auto mb-3 text-2xl text-gray-800" />
                                    <h3 className="mb-2 text-xl font-semibold text-gray-800">Priority Support</h3>
                                    <p className="text-sm text-gray-700">24/7 road assistance</p>
                                </div>
                                <div className="rounded-lg bg-yellow-50/20 p-6">
                                    <FaCalendarCheck className="mx-auto mb-3 text-2xl text-gray-800" />
                                    <h3 className="mb-2 text-xl font-semibold text-gray-800">Early Access</h3>
                                    <p className="text-sm text-gray-700">Book trips before others</p>
                                </div>
                                <div className="rounded-lg bg-yellow-50/20 p-6">
                                    <FaMedal className="mx-auto mb-3 text-2xl text-gray-800" />
                                    <h3 className="mb-2 text-xl font-semibold text-gray-800">Exclusive Badges</h3>
                                    <p className="text-sm text-gray-700">Show your HVK status</p>
                                </div>
                            </div>

                            <div className="mb-8 text-4xl font-normal text-gray-800">
                                ₹12,000 <span className="text-xl font-normal text-gray-700">per year</span>
                            </div>

                            <button className="text-md rounded-lg bg-neutral-800 px-12 py-6 font-normal text-primary shadow-lg transition-colors hover:bg-neutral-700">
                                Join Club 12 Coming Soon
                            </button>
                        </div>
                    </div>
                </div>

                {/* Why Shop with HVK? */}
                <div className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-12 text-center text-3xl font-normal text-gray-800">Why Shop with HVK?</h2>
                        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
                            <div className="flex flex-col items-center">
                                <div className="mb-4 rounded-full bg-primary p-4">
                                    <FaTruck className="text-2xl text-gray-800" />
                                </div>
                                <h3 className="mb-2 text-xl font-normal text-gray-800">Free Shipping</h3>
                                <p className="text-sm text-gray-600">Free shipping on all orders above ₹999 across India</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="mb-4 rounded-full bg-primary p-4">
                                    <FaHeart className="text-2xl text-gray-800" />
                                </div>
                                <h3 className="mb-2 text-xl font-normal text-gray-800">Community Support</h3>
                                <p className="text-sm text-gray-600">All proceeds support HVK platform and community growth</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="mb-4 rounded-full bg-primary p-4">
                                    <FaShieldAlt className="text-2xl text-gray-800" />
                                </div>
                                <h3 className="mb-2 text-xl font-normal text-gray-800">Quality Guaranteed</h3>
                                <p className="text-sm text-gray-600">Premium materials tested by real road trippers</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Testimonial */}
                <div className="bg-gray-100 py-16">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="text-lg leading-snug font-normal text-gray-800">
                                "The HVK RoutO app saved my Ladakh trip when network was down. The offline maps with HVK's route notes were a
                                lifesaver!"
                            </p>
                            <p className="mt-8 text-base font-normal text-primary italic">– Priya Menon, Club 12 Member</p>
                        </div>
                    </div>
                </div>
            </>
        </RootLayout>
    );
};

export default StorePage;
