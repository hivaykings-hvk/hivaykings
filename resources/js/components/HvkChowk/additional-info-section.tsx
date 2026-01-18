import { AlertCircle, Camera, Coffee, MapPin } from 'lucide-react';

export default function AdditionalInfoSection() {
    const sections = [
        {
            icon: MapPin,
            title: 'Map View',
            description: 'View the route on an interactive map',
        },
        {
            icon: Coffee,
            title: 'Facilities & Services',
            description: 'Restaurants, hotels, and rest stops along the route',
        },
        {
            icon: AlertCircle,
            title: 'Travel Tips',
            description: 'Important tips and safety information for travelers',
        },
        {
            icon: Camera,
            title: 'Photo Gallery',
            description: 'Photos shared by travelers on this road',
        },
    ];

    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4">
                <h2 className="mb-8 text-3xl font-bold text-gray-800">Additional Information</h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {sections.map((section, idx) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={idx}
                                className="flex cursor-pointer flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-6 text-center transition-all hover:border-yellow-300 hover:bg-yellow-50"
                            >
                                <div className="mb-4 rounded-full bg-yellow-100 p-3">
                                    <Icon className="h-6 w-6 text-yellow-600" />
                                </div>
                                <h3 className="mb-2 font-semibold text-gray-800">{section.title}</h3>
                                <p className="text-sm text-gray-600">{section.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
