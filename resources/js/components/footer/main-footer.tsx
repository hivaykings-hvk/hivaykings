import { Link } from '@inertiajs/react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa6';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-bgNavBarBlack py-12 text-white">
            <div className="container mx-auto px-4">
                <div className="mb-8 grid grid-cols-1 gap-8 border-b border-gray-500 pb-8 text-center lg:grid-cols-4 lg:text-left">
                    {/* Logo and Description */}
                    <div className="flex flex-col items-center lg:items-start">
                        <Link href="/" className="mb-4 flex items-center gap-2">
                            <img src="/logo.png" alt="HiVayKings Logo" className="h-12 w-auto md:h-14 lg:h-16" />
                            <div className="text-xl font-semibold text-primary">HiVayKings</div>
                        </Link>
                        <p className="text-sm text-gray-300">Where travelers meet, routes are discovered, and journeys are shared.</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-lg">Quick Links</h3>
                        <ul className="flex flex-col items-center lg:items-start">
                            <li className="mb-2">
                                <Link href="/" className="font-light text-gray-300 hover:text-primary">
                                    Home
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/hvk-chowk" className="font-light text-gray-300 hover:text-primary">
                                    HVK Chowk
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/hvk-store" className="font-light text-gray-300 hover:text-primary">
                                    HVK Store
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/road-ratings" className="font-light text-gray-300 hover:text-primary">
                                    Road Ratings
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h3 className="mb-4 text-lg">Community</h3>
                        <ul className="flex flex-col items-center lg:items-start">
                            <li className="mb-2">
                                <Link href="/about" className="font-light text-gray-300 hover:text-primary">
                                    About HVK
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/guidelines" className="font-light text-gray-300 hover:text-primary">
                                    Community Guidelines
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/privacy" className="font-light text-gray-300 hover:text-primary">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/terms" className="font-light text-gray-300 hover:text-primary">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="mb-4 text-lg">Follow Us</h3>
                        <div className="mb-4 flex items-center justify-center space-x-4 md:mb-0 lg:justify-start">
                            <Link href="#">
                                <FaFacebook className="h-6 w-6 text-gray-300" />
                            </Link>
                            <Link href="#">
                                <FaInstagram className="h-7 w-7 text-gray-300" />
                            </Link>
                            <Link href="#">
                                <FaYoutube className="h-8 w-8 text-gray-300" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Follow Us and Copyright */}
                <div className="text-center text-sm text-gray-300">
                    <div>&copy; {currentYear} HiVayKings. All rights reserved. Dedicated to HV Kumar.</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
