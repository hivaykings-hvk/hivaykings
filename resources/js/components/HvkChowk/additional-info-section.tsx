import { BsFillFuelPumpFill } from 'react-icons/bs';
import { FaCamera, FaLightbulb, FaMap } from 'react-icons/fa6';

export default function AdditionalInfoSection() {
    const infoCards = [
        {
            icon: <FaMap className="h-8 w-8 text-gray-800" />,
            title: 'Request map in RoutO',
            description: 'HVK designed offline map for ease of navigation & support.',
        },
        {
            icon: <BsFillFuelPumpFill className="h-8 w-8 text-gray-800" />,
            title: 'Facilities',
            description: 'Fuel stations, restaurants, and rest areas along route',
        },
        {
            icon: <FaLightbulb className="h-8 w-8 text-gray-800" />,
            title: 'Travel Tips',
            description: 'Weather updates, driving advice, and seasonal alerts',
        },
        {
            icon: <FaCamera className="h-8 w-8 text-gray-800" />,
            title: 'Photo Gallery',
            description: 'User-uploaded scenic images from the route',
        },
    ];
    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-8">
                <h2 className="mb-6 text-2xl font-semibold text-gray-800">Additional Information</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {infoCards.map((card, index) => (
                        <div key={index} className="flex flex-col items-start rounded-lg bg-gray-50 p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-4">
                                <div className="h-5 w-5 text-gray-800">{card.icon}</div>
                                <div className="text-md font-semibold text-gray-800">{card.title}</div>
                            </div>

                            <p className="text-sm text-gray-600">{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
