'use client';

import hvkPhoto from '@/assets/images/about-us/hvk-image.jpg';
import image1 from '@/assets/images/about-us/photo-gallery/image-1.png';
import image2 from '@/assets/images/about-us/photo-gallery/image-2.png';
import image3 from '@/assets/images/about-us/photo-gallery/image-3.png';
import image4 from '@/assets/images/about-us/photo-gallery/image-4.png';
import image5 from '@/assets/images/about-us/photo-gallery/image-5.png';
import image6 from '@/assets/images/about-us/photo-gallery/image-6.png';
import RootLayout from '@/Layouts/RootLayout';
import {
    FaAward,
    FaBook,
    FaBookOpen,
    FaBullseye,
    FaCalendar,
    FaCircleCheck,
    FaClock,
    FaEye,
    FaFlag,
    FaHeadset,
    FaHeart,
    FaMap,
    FaMicrophone,
    FaMountain,
    FaQuoteLeft,
    FaRoad,
    FaSun,
    FaTrophy,
    FaUsers,
    FaWater,
} from 'react-icons/fa6';

const AboutPage = () => {
    return (
        <RootLayout>
            <>
                {/* Hero Section */}
                <section className="flex items-center justify-start bg-gradient-to-r from-[#333333] to-[#374151] px-4 py-20 text-white">
                    <div className="max-w-4xl">
                        <h1 className="mb-4 text-5xl font-normal md:text-6xl">
                            About <span className="text-primary">HV Kumar</span> – The <br />
                            Human GPS
                        </h1>
                        <p className="mb-8 text-base">40+ years of driving, guiding, and building a community on India's highways</p>
                        <div className="flex space-x-4">
                            <button className="hover:bg-opacity-90 rounded-md bg-primary px-6 py-3 font-normal text-black transition-all">
                                Join the Tribe
                            </button>
                            <button className="rounded-md border border-primary px-6 py-3 font-normal text-white transition-all hover:bg-primary hover:text-black">
                                Follow HVK
                            </button>
                        </div>
                    </div>
                </section>

                {/* Personal & Professional Background */}
                <section className="bg-white px-4 py-20 md:px-8 lg:px-16">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="mb-12 text-center text-2xl font-normal text-gray-800">Personal & Professional Background</h2>
                        <div className="flex flex-col items-start gap-8 md:flex-row">
                            {/* Image */}
                            <div className="flex h-96 w-full flex-1 items-center justify-center rounded-lg">
                                <img src={hvkPhoto} alt="HVK Photo" className="h-full w-fit rounded-lg object-cover" />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <p className="mb-6 text-base text-gray-700">
                                    HV Kumar, born in 1963 in Mumbai, is a qualified Chartered Accountant and Company Secretary with decades of
                                    professional consulting experience. But beyond his corporate credentials lies a passionate road traveler who has
                                    transformed his love for highways into a mission to help fellow travelers.
                                </p>
                                <p className="mb-6 text-base text-gray-700">
                                    Since 1986, Kumar has meticulously logged over{' '}
                                    <span className="font-semibold text-primary">800,000 kilometers</span> across Indian roads, documenting routes,
                                    fuel stops, road conditions, and scenic spots. His journey began with a simple love for exploration but evolved
                                    into something much greater— becoming India's most trusted "Human GPS."
                                </p>
                                <div className="rounded-r-md border-l-4 border-primary bg-gray-50 py-2 pl-4">
                                    <p className="text-gray-800 italic">
                                        "What started as personal travel logs became a calling to help others navigate India's vast highway network
                                        with confidence and safety."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Road Journeys & Expertise */}
                <section className="bg-gray-50 px-4 pt-20 pb-4 md:px-8 lg:px-16">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="mb-8 text-center text-2xl font-normal text-gray-800">Road Journeys & Expertise</h2>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Card 1: Kilometers Traveled */}
                            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-sm">
                                <FaRoad className="mb-4 text-3xl text-primary" />
                                <p className="mb-2 text-2xl font-normal text-gray-800">800,000+</p>
                                <p className="text-gray-600">Kilometers Traveled</p>
                            </div>

                            {/* Card 2: Years of Experience */}
                            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-sm">
                                <FaCalendar className="mb-4 text-3xl text-primary" />
                                <p className="mb-2 text-2xl font-normal text-gray-800">38+</p>
                                <p className="text-gray-600">Years of Experience</p>
                            </div>

                            {/* Card 3: Routes Documented */}
                            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-sm">
                                <FaBook className="mb-4 text-3xl text-primary" />
                                <p className="mb-2 text-2xl font-normal text-gray-800">1000+</p>
                                <p className="text-gray-600">Routes Documented</p>
                            </div>

                            {/* Card 4: Travelers Helped */}
                            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-sm">
                                <FaUsers className="mb-4 text-3xl text-primary" />
                                <p className="mb-2 text-2xl font-normal text-gray-800">50,000+</p>
                                <p className="text-gray-600">Travelers Helped</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The HVK Method */}
                <section className="bg-gray-50 px-4 pt-8 pb-20 md:px-8 lg:px-16">
                    <div className="mx-auto lg:px-20">
                        <h2 className="mb-4 text-xl font-normal text-gray-800">The HVK Method</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Method Card 1: Meticulous Documentation */}
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <FaMap className="mb-4 text-4xl text-primary" />
                                <h3 className="mb-2 text-xl font-normal text-gray-800">Meticulous Documentation</h3>
                                <p className="text-gray-600">
                                    Every journey is logged with GPS coordinates, photographs, fuel stops, food recommendations, and real-time road
                                    conditions.
                                </p>
                            </div>

                            {/* Method Card 2: Free Guidance */}
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <FaHeadset className="mb-4 text-4xl text-primary" />
                                <h3 className="mb-2 text-xl font-normal text-gray-800">Free Guidance</h3>
                                <p className="text-gray-600">
                                    All route planning and advice is provided free of cost, driven by a passion to help fellow travelers explore India
                                    safely.
                                </p>
                            </div>

                            {/* Method Card 3: Real-Time Updates */}
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <FaClock className="mb-4 text-4xl text-primary" />
                                <h3 className="mb-2 text-xl font-normal text-gray-800">Real-Time Updates</h3>
                                <p className="text-gray-600">
                                    Regular highway visits ensure information stays current, including construction updates, new facilities, and
                                    seasonal changes.
                                </p>
                            </div>

                            {/* Method Card 4: Lived Experience */}
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <FaHeart className="mb-4 text-4xl text-primary" />
                                <h3 className="mb-2 text-xl font-normal text-gray-800">Lived Experience</h3>
                                <p className="text-gray-600">
                                    Not just maps and data, but real experiences from someone who has actually driven every recommended route multiple
                                    times.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Community Contributions & Impact */}
                <section className="bg-white px-4 py-20 md:px-8 lg:px-16">
                    <div className="mx-auto lg:px-20">
                        <h2 className="mb-12 text-center text-2xl font-normal text-gray-800">Community Contributions & Impact</h2>
                        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
                            {/* Left Column: Building the HVK Community */}
                            <div>
                                <h3 className="mb-4 text-xl font-normal text-gray-800">Building the HVK Community</h3>
                                <p className="mb-6 text-base text-gray-700">
                                    In 2009, HV Kumar started the HVK Forum, creating India's most trusted platform for highway information. What
                                    began as a small community has grown into a network of over 50,000 travelers who rely on Kumar's expertise and the
                                    collective wisdom of fellow road enthusiasts.
                                </p>
                                <p className="text-base text-gray-700">
                                    The forum has helped countless travelers plan safe journeys, avoid problematic routes, and discover hidden gems
                                    along India's highways. From emergency roadside assistance coordination to detailed route planning for family
                                    trips, the HVK community has become an indispensable resource.
                                </p>
                            </div>

                            {/* Right Column: Media Recognition */}
                            <div className="rounded-lg bg-gray-50 p-6">
                                <h4 className="mb-4 text-lg font-normal text-gray-800">Media Recognition</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <FaQuoteLeft className="mt-1 mr-3 flex-shrink-0 text-xl text-primary" />
                                        <p className="text-gray-700">Featured in Team-BHP forums</p>
                                    </li>
                                    <li className="flex items-start">
                                        <FaBookOpen className="mt-1 mr-3 flex-shrink-0 text-xl text-primary" />
                                        <p className="text-gray-700">Highway expertise cited in travel blogs</p>
                                    </li>
                                    <li className="flex items-start">
                                        <FaMicrophone className="mt-1 mr-3 flex-shrink-0 text-xl text-primary" />
                                        <p className="text-gray-700">Guest on travel podcasts</p>
                                    </li>
                                    <li className="flex items-start">
                                        <FaAward className="mt-1 mr-3 flex-shrink-0 text-xl text-primary" />
                                        <p className="text-gray-700">Recognized as India's "Human GPS"</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mx-auto mt-12 w-full rounded-xl bg-bgNavBarBlack px-6 py-8 text-center">
                            <p className="mb-6 text-base text-white italic">
                                "I trust HVK's route tips more than my GPS; he sees what maps don't. His advice saved our family trip to Ladakh when
                                he warned us about road conditions that no app would've known about."
                            </p>
                            <p className="text-sm font-normal text-primary">– Priya Mehta, HVK Forum Member</p>
                        </div>
                    </div>
                </section>

                {/* Milestones & Journey Highlights */}
                <section className="bg-gray-50 px-4 pt-20 pb-10 md:px-8 lg:px-16">
                    <div className="mx-auto lg:px-20">
                        <h2 className="mb-12 text-center text-2xl font-normal text-gray-800">Milestones & Journey Highlights</h2>
                        <div className="space-y-8">
                            {/* Milestone 1: 1986 - The Beginning */}
                            <div className="flex items-start justify-between rounded-lg border-l-2 border-l-primary bg-white p-6 shadow-sm">
                                <div>
                                    <h3 className="mb-2 text-xl font-normal text-gray-800">1986 – The Beginning</h3>
                                    <p className="text-gray-600">
                                        First major road trip from Mumbai to Manali, sparking a lifelong passion for highway exploration and
                                        documentation.
                                    </p>
                                </div>
                                <FaFlag className="ml-6 flex-shrink-0 text-xl text-primary" />
                            </div>

                            {/* Milestone 2: 2009 - Community Foundation */}
                            <div className="flex items-start justify-between rounded-lg border-l-2 border-l-primary bg-white p-6 shadow-sm">
                                <div>
                                    <h3 className="mb-2 text-xl font-normal text-gray-800">2009 – Community Foundation</h3>
                                    <p className="text-gray-600">
                                        Launched the HVK Forum online, creating India's first comprehensive highway information community platform.
                                    </p>
                                </div>
                                <FaUsers className="ml-6 flex-shrink-0 text-xl text-primary" />
                            </div>

                            {/* Milestone 3: 2015 - Half Million Milestone */}
                            <div className="flex items-start justify-between rounded-lg border-l-2 border-l-primary bg-white p-6 shadow-sm">
                                <div>
                                    <h3 className="mb-2 text-xl font-normal text-gray-800">2015 – Half Million Milestone</h3>
                                    <p className="text-gray-600">
                                        Completed 500,000 kilometers of documented highway travel, establishing credibility as India's most
                                        experienced road guide.
                                    </p>
                                </div>
                                <FaRoad className="ml-6 flex-shrink-0 text-xl text-primary" />
                            </div>

                            {/* Milestone 4: 2023 - 800,000 KM Achievement */}
                            <div className="flex items-start justify-between rounded-lg border-l-2 border-l-primary bg-white p-6 shadow-sm">
                                <div>
                                    <h3 className="mb-2 text-xl font-normal text-gray-800">2023 – 800,000 KM Achievement</h3>
                                    <p className="text-gray-600">
                                        Reached the remarkable milestone of 800,000 kilometers traveled, with every route meticulously documented and
                                        shared.
                                    </p>
                                </div>
                                <FaTrophy className="ml-6 flex-shrink-0 text-xl text-primary" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Favorite Routes */}
                <section className="bg-gray-50 px-4 pb-20 md:px-8 lg:px-16">
                    <div className="mx-auto lg:px-20">
                        <div className="rounded-xl bg-white pt-10 text-center">
                            <h3 className="mb-8 text-xl font-normal text-gray-800">Favorite Routes</h3>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                {/* Route Card 1: Mumbai-Goa (NH66) */}
                                <div className="flex flex-col items-center p-6">
                                    <FaWater className="mb-4 text-3xl text-primary" />
                                    <h4 className="mb-2 text-lg font-normal text-gray-800">Mumbai-Goa (NH66)</h4>
                                    <p className="text-center text-gray-600">The coastal highway that started it all</p>
                                </div>

                                {/* Route Card 2: Leh-Manali */}
                                <div className="flex flex-col items-center p-6">
                                    <FaMountain className="mb-4 text-3xl text-primary" />
                                    <h4 className="mb-2 text-lg font-normal text-gray-800">Leh-Manali</h4>
                                    <p className="text-center text-gray-600">The ultimate high-altitude adventure</p>
                                </div>

                                {/* Route Card 3: East Coast Road (ECR) */}
                                <div className="flex flex-col items-center p-6">
                                    <FaSun className="mb-4 text-3xl text-primary" />
                                    <h4 className="mb-2 text-lg font-normal text-gray-800">East Coast Road (ECR)</h4>
                                    <p className="text-center text-gray-600">Scenic beauty meets perfect road conditions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Photo Gallery */}
                <section className="bg-white px-4 py-20 md:px-8 lg:px-16">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="mb-12 text-center text-2xl font-normal text-gray-800">Photo Gallery</h2>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Gallery Item 1 */}
                            <div className="group relative overflow-hidden rounded-lg shadow-sm">
                                <img
                                    src={image1}
                                    alt="HVK's Travel Logbooks"
                                    className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            {/* Gallery Item 2 */}
                            <div className="group relative overflow-hidden rounded-lg shadow-sm">
                                <img
                                    src={image2}
                                    alt="Highway Milestones"
                                    className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            {/* Gallery Item 3 */}
                            <div className="group relative overflow-hidden rounded-lg shadow-sm">
                                <img
                                    src={image3}
                                    alt="Epic Road Journeys"
                                    className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            {/* Gallery Item 4 */}
                            <div className="group relative overflow-hidden rounded-lg shadow-sm">
                                <img
                                    src={image4}
                                    alt="Recommended Dhaba Stops"
                                    className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            {/* Gallery Item 5 */}
                            <div className="group relative overflow-hidden rounded-lg shadow-sm">
                                <img
                                    src={image5}
                                    alt="Navigation & Planning"
                                    className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            {/* Gallery Item 6 */}
                            <div className="group relative overflow-hidden rounded-lg shadow-sm">
                                <img
                                    src={image6}
                                    alt="Community Meetups"
                                    className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vision & Mission */}
                <section className="bg-[#282a2e] px-4 py-20 text-white md:px-8 lg:px-16">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="mb-12 text-center text-2xl font-normal">Vision & Mission</h2>
                        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-2">
                            {/* Our Vision */}
                            <div>
                                <FaEye className="mx-auto mb-4 text-5xl text-primary" />
                                <h3 className="mb-2 text-xl font-semibold">Our Vision</h3>
                                <p className="text-gray-300">
                                    To make every highway journey in India safe, enjoyable, and memorable by providing travelers with accurate,
                                    real-time information based on genuine experience rather than just digital data.
                                </p>
                            </div>

                            {/* Our Mission */}
                            <div>
                                <FaBullseye className="mx-auto mb-4 text-5xl text-primary" />
                                <h3 className="mb-2 text-xl font-semibold">Our Mission</h3>
                                <p className="text-gray-300">
                                    To build India's most trusted road travel community where experienced travelers share honest insights, real-time
                                    updates, and proven route recommendations to help fellow explorers.
                                </p>
                            </div>
                        </div>

                        {/* What You Can Expect from HVK */}
                        <div className="mt-16 rounded-lg bg-[#333333] p-8">
                            <h3 className="mb-8 text-center text-xl font-semibold">What You Can Expect from HVK</h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="flex items-start">
                                    <FaCircleCheck className="mt-1 mr-3 flex-shrink-0 text-xl text-primary" />
                                    <p className="text-gray-300">Honest route recommendations</p>
                                </div>
                                <div className="flex items-start">
                                    <FaCircleCheck className="mt-1 mr-3 flex-shrink-0 text-xl text-primary" />
                                    <p className="text-gray-300">Real-time road status updates</p>
                                </div>
                                <div className="flex items-start">
                                    <FaCircleCheck className="mt-1 mr-3 flex-shrink-0 text-xl text-primary" />
                                    <p className="text-gray-300">Community-verified information</p>
                                </div>
                                <div className="flex items-start">
                                    <FaCircleCheck className="mt-1 mr-3 flex-shrink-0 text-xl text-primary" />
                                    <p className="text-gray-300">Free expert guidance</p>
                                </div>
                                <div className="flex items-start">
                                    <FaCircleCheck className="mt-1 mr-3 flex-shrink-0 text-xl text-primary" />
                                    <p className="text-gray-300">Detailed facility information</p>
                                </div>
                                <div className="flex items-start">
                                    <FaCircleCheck className="mt-1 mr-3 flex-shrink-0 text-xl text-primary" />
                                    <p className="text-gray-300">Trusted travel community</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-primary px-4 py-20 text-center md:px-8 lg:px-16">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-800 md:text-3xl">Ready to Join HVK's Journey?</h2>
                        <p className="mb-8 text-lg text-gray-700">
                            Become part of India's most trusted road travel community and get access to 38+ years of highway expertise
                        </p>
                        <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                            <button className="rounded-md bg-[#333333] px-8 py-3 font-semibold text-white transition-colors hover:bg-gray-700">
                                Get Route Advice from HVK
                            </button>
                            <button className="rounded-md border border-[#333333] px-8 py-3 font-semibold text-gray-800 transition-colors hover:bg-[#333333] hover:text-white">
                                Subscribe for Updates
                            </button>
                        </div>
                    </div>
                </section>
            </>
        </RootLayout>
    );
};

export default AboutPage;
