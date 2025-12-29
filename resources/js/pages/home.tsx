import featuredImage1 from '@/assets/images/featured-image-1.jpg';
import featuredImage2 from '@/assets/images/featured-image-2.jpg';
import featuredImage3 from '@/assets/images/featured-image-3.jpg';
import heroImage from '@/assets/images/hero.png';

import RootLayout from '@/Layouts/RootLayout';
import React from 'react';
import { FaHeart, FaStar } from 'react-icons/fa';
import { FaBookOpen, FaComment, FaCompass, FaRoute, FaUserTie } from 'react-icons/fa6'; // Grouped imports for clarity

const features = [
    {
        icon: FaCompass,
        title: 'Route Advice',
        description: 'Expert Guidance',
    },
    {
        icon: FaRoute,
        title: 'Road Trips',
        description: 'Epic Journeys Shared',
    },
    {
        icon: FaBookOpen,
        title: 'Road Stories',
        description: 'Inspiring post by community',
    },
    {
        icon: FaStar,
        title: 'Road Ratings',
        description: 'Honest reviews of highways',
    },
    {
        icon: FaUserTie,
        title: 'HVK',
        description: 'Human GPS aka Kumar HV',
    },
];

function Home() {
    return (
        <>
            {/* <!-- Hero Section --> */}
            <div
                className="-mt-[75px] min-h-[550px] bg-neutral-700 bg-cover bg-center bg-blend-overlay md:min-h-[650px]"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="container mx-auto px-3">
                    <div className="mx-auto flex flex-col items-start py-12 md:py-20">
                        <h1 className="pt-20 text-4xl font-medium text-white md:text-5xl">
                            Your Co-pilot for <br />
                            <span className="text-primary">every journey</span>
                        </h1>
                        <p className="md:text-md mt-8 text-sm text-gray-200">When you travel we travel with you.</p>
                        <div className="mt-16 flex gap-6 md:flex-row">
                            <a href="/signup" className="text-md rounded-lg bg-primary px-6 py-3 md:text-xl">
                                Join the Tribe
                            </a>
                            <a href="/hvk-chowk" className="text-md rounded-lg border border-primary px-6 py-3 text-primary md:text-xl">
                                Ask HVK
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/*<!-- Hero section end --> */}

            {/* <!-- Feature section --> */}
            <div className="">
                <div className="container mx-auto px-4 py-8">
                    <div className="py-8 text-center text-2xl font-medium text-gray-800">What Makes Us Special</div>
                </div>

                <div className="container mx-auto pb-8">
                    <div className="flex flex-col items-center justify-between md:flex-row md:space-x-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="mb-8 flex flex-1 flex-grow flex-col rounded-xl bg-bgLightGray px-4 py-8 text-center">
                                    <div className="w-fit self-center text-primary">
                                        <Icon className="h-10 w-10" />
                                    </div>
                                    <div className="mt-3 mb-2 font-medium text-gray-700">{feature.title}</div>
                                    <p className="text-sm text-zinc-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* <!-- Feature section end --> */}

            {/* Ask HVK */}
            <div className="bg-grayishBg pt-16 pb-20">
                <div className="container mx-auto">
                    <div className="text-center text-2xl text-gray-800">Ask HVK - The Highway Guru</div>
                    <p className="pt-4 text-center text-xs text-gray-600">
                        A space where anyone can ask about road status, routes and trip planning.
                    </p>
                    <div className="mt-8 flex items-center justify-center px-3">
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
                            <div className="max-w-96 rounded-lg border-l-4 border-primary bg-white py-4 pr-4 pl-8 shadow-sm">
                                <div className="text-sm text-gray-800">What is the road status between Manali to Kaza?</div>
                                <div className="mt-4 flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <FaComment className="h-3 w-3 text-gray-500" /> <span className="text-xs text-gray-500">12 Answers</span>
                                    </div>
                                    <div className="text-xs text-gray-500">3h ago</div>
                                </div>
                            </div>
                            <div className="max-w-96 rounded-lg border-l-4 border-primary bg-white py-4 pr-4 pl-8 shadow-sm">
                                <div className="text-sm text-gray-800">What is the quickest route to Goa from Mumbai?</div>
                                <div className="mt-4 flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <FaComment className="h-3 w-3 text-gray-500" /> <span className="text-xs text-gray-500">8 Answers</span>
                                    </div>
                                    <div className="text-xs text-gray-500">5h ago</div>
                                </div>
                            </div>
                            <div className="max-w-96 rounded-lg border-l-4 border-primary bg-white py-4 pr-4 pl-8 shadow-sm">
                                <div className="text-sm text-gray-800">Are facilites working on Puruvanchal expressway?</div>
                                <div className="mt-4 flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <FaComment className="h-3 w-3 text-gray-500" /> <span className="text-xs text-gray-500">15 Answers</span>
                                    </div>
                                    <div className="text-xs text-gray-500">1d ago</div>
                                </div>
                            </div>
                            <div className="max-w-96 rounded-lg border-l-4 border-primary bg-white py-4 pr-4 pl-8 shadow-sm">
                                <div className="text-sm text-gray-800">Best dhaba stops between Bangalore and Hyderabad?</div>
                                <div className="mt-4 flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <FaComment className="h-3 w-3 text-gray-500" /> <span className="text-xs text-gray-500">21 Answers</span>
                                    </div>
                                    <div className="text-xs text-gray-500">2d ago</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Ask HVK End */}

            {/* Live Highway & Route Ratings */}
            <div className="bg-white pt-10 pb-10">
                <div className="container mx-auto py-4">
                    <div className="pb-8 text-center text-2xl text-gray-800">Road Ratings - Know Before You Go</div>

                    <div className="mx-4">
                        <div className="my-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            <div className="w-full rounded-xl border border-none bg-bgLightGray px-6 py-6">
                                <div className="flex items-start justify-between pt-2">
                                    <div className="text-md font-medium">Mumbai → Pune Expressway</div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-medium text-primary">4.3</div>
                                        <div className="items-center-gap-1 flex">
                                            <FaStar className="h-4 w-4 text-primary" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col pt-3">
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="text-xs text-zinc-800">Road Condition</div>
                                        <div className="flex items-center">
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-gray-300" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="text-xs text-zinc-800">Traffic</div>
                                        <div className="flex items-center">
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-gray-300" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="text-xs text-zinc-800">Facilities</div>
                                        <div className="flex items-center">
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-gray-300" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="text-xs text-zinc-800">Scenic Value</div>
                                        <div className="flex items-center">
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-gray-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full rounded-xl border border-none bg-bgLightGray px-6 py-6">
                                <div className="flex items-start justify-between pt-2">
                                    <div className="text-md font-medium">Delhi → Chandigarh Expressway</div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-medium text-primary">4.3</div>
                                        <div className="items-center-gap-1 flex">
                                            <FaStar className="h-4 w-4 text-primary" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col pt-3">
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="text-xs text-zinc-800">Road Condition</div>
                                        <div className="flex items-center">
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-gray-300" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="text-xs text-zinc-800">Traffic</div>
                                        <div className="flex items-center">
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-gray-300" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="text-xs text-zinc-800">Facilities</div>
                                        <div className="flex items-center">
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-gray-300" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="text-xs text-zinc-800">Scenic Value</div>
                                        <div className="flex items-center">
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-gray-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full rounded-xl border border-none bg-bgLightGray px-6 py-6">
                                <div className="flex items-start justify-between pt-2">
                                    <div className="text-md font-medium">Bangalore → Goa Highway</div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-medium text-primary">4.3</div>
                                        <div className="items-center-gap-1 flex">
                                            <FaStar className="h-4 w-4 text-primary" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col pt-3">
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="text-xs text-zinc-800">Road Condition</div>
                                        <div className="flex items-center">
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-gray-300" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="text-xs text-zinc-800">Traffic</div>
                                        <div className="flex items-center">
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-gray-300" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="text-xs text-zinc-800">Facilities</div>
                                        <div className="flex items-center">
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-gray-300" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="text-xs text-zinc-800">Scenic Value</div>
                                        <div className="flex items-center">
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-primary" />
                                            <FaStar className="h-4 w-4 text-gray-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Live Highway & Route Ratings End */}

            {/* Live Road Updates */}
            <div className="bg-grayishBg pt-10 pb-16">
                <div className="container mx-auto">
                    <div className="pb-4 text-center text-2xl text-gray-800">Live Road Updates</div>
                    <div className="mt-8 flex flex-col items-center justify-center gap-6 px-3">
                        <div className="w-full max-w-3xl rounded-lg border-l-4 border-primary bg-white py-4 pr-4 pl-8 shadow-sm">
                            <div className="text-md pb-2 text-gray-800">Mumbai-Goa Highway fuel stops?</div>
                            <p className="text-sm text-gray-600">Looing for clean restrooms and good food options along NH66.</p>
                            <div className="mt-2 flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <FaHeart className="h-3 w-3 text-red-500" /> <span className="text-xs text-gray-500">156 Likes</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaComment className="h-3 w-3 text-gray-500" /> <span className="text-xs text-gray-500">43 Replies</span>
                                </div>
                                <div className="text-xs text-gray-500">4h ago</div>
                            </div>
                        </div>
                        <div className="w-full max-w-3xl rounded-lg border-l-4 border-green-500 bg-white py-4 pr-4 pl-8 shadow-sm">
                            <div className="text-md pb-2 text-gray-800">Manali-Leh condition updates?</div>
                            <p className="text-sm text-gray-600">Heavy snowfall at Rohtang pass, road closed until further notice.</p>
                            <div className="mt-2 flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <FaHeart className="h-3 w-3 text-red-500" /> <span className="text-xs text-gray-500">24 Likes</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaComment className="h-3 w-3 text-gray-500" /> <span className="text-xs text-gray-500">8 Replies</span>
                                </div>
                                <div className="text-xs text-gray-500">3h ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Live Road Updates End */}

            {/* <!-- Road Stories Section --> */}
            <div className="bg-white py-10 pb-20">
                <div className="container mx-auto">
                    <div className="text-center text-2xl">Road Stories</div>

                    {/* <!-- Featured travelogues stories --> */}

                    <div className="mx-4 flex items-center justify-between pt-10">
                        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex h-full w-full flex-col overflow-x-hidden rounded-lg border border-none bg-white shadow-lg">
                                <div className="min-h-[200px] w-full bg-cover bg-center" style={{ backgroundImage: `url(${featuredImage1})` }}></div>
                                <div className="my-4 px-4">
                                    <div className="text-lg font-semibold">Ladakh Diaries: 15 days of pure magic</div>
                                    <p className="mt-3 text-zinc-600">
                                        An epic journey through the highest motorable roads in the world, capturing the essence of...
                                    </p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 overflow-hidden rounded-full border border-none">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_OCI_BUCKET_BASE_URL}/f23580cd-21b5-4127-87ee-9d5656584917/e2b205ad-7736-4c58-ac48-91d19d5d6334.webp`}
                                                    alt=""
                                                    height={30}
                                                    width={30}
                                                />
                                            </div>
                                            <div className="text-sm text-gray-500">AdventureSeeker</div>
                                        </div>
                                        <div className="text-medium font-medium text-primary">
                                            <a href="">Read More</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex h-full w-full flex-col overflow-x-hidden rounded-lg border border-none bg-white shadow-lg">
                                <div className="min-h-[200px] w-full bg-cover bg-center" style={{ backgroundImage: `url(${featuredImage2})` }}></div>
                                <div className="my-4 px-4">
                                    <div className="text-lg font-semibold">Costal Karnataka: Hidden Gems</div>
                                    <p className="mt-3 text-zinc-600">
                                        Discovering pristine beaches and winding costal roads that most travelers miss...
                                    </p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 overflow-hidden rounded-full border border-none">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_OCI_BUCKET_BASE_URL}/f23580cd-21b5-4127-87ee-9d5656584917/e2b205ad-7736-4c58-ac48-91d19d5d6334.webp`}
                                                    alt=""
                                                    height={30}
                                                    width={30}
                                                />
                                            </div>
                                            <div className="text-sm text-gray-500">CostalExplorer</div>
                                        </div>
                                        <div className="text-medium font-medium text-primary">
                                            <a href="">Read More</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex h-full w-full flex-col overflow-x-hidden rounded-lg border border-none bg-white shadow-lg">
                                <div className="min-h-[200px] w-full bg-cover bg-center" style={{ backgroundImage: `url(${featuredImage3})` }}></div>
                                <div className="my-4 px-4">
                                    <div className="text-lg font-semibold">Rajastan Circuit: Royal Roads</div>
                                    <p className="mt-3 text-zinc-600">
                                        A magestic journey through the lands of kings, exploring palaces and desert highways...
                                    </p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 overflow-hidden rounded-full border border-none">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_OCI_BUCKET_BASE_URL}/f23580cd-21b5-4127-87ee-9d5656584917/e2b205ad-7736-4c58-ac48-91d19d5d6334.webp`}
                                                    alt=""
                                                    height={30}
                                                    width={30}
                                                />
                                            </div>
                                            <div className="text-sm text-gray-500">RoyalRoads</div>
                                        </div>
                                        <div className="text-medium font-medium text-primary">
                                            <a href="">Read More</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Road Stories Section end --> */}

            <div className="bg-bgNavBarBlack py-16">
                <div className="container mx-auto">
                    <div className="px-4 text-center text-xl font-medium text-gray-100">
                        {`"HiVayKings isn't just a community, its a family where every`} <br />{' '}
                        {` road leads to new frendships and unforgettable adventures."`}
                    </div>
                    <div className="pt-8 text-center text-sm text-primary italic">- Rahul Sharma, Member since 2022</div>
                </div>
            </div>
        </>
    );
}

Home.layout = function (page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};

export default Home;
