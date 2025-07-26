import React, { useState } from 'react';

const ActivityTabs = ({ activity }) => {
    const [activeTab, setActiveTab] = useState('description');
      // Use included and requirements from the database or fallback to defaults
    const inclusions = activity.included && activity.included.length > 0 ? 
        activity.included : 
        [
            "Professional English-speaking guide",
            "Hotel pickup and drop-off",
            "All equipment needed for the activity",
            "Bottled water and refreshments",
            "Safety briefing",
            "Insurance"
        ];
    
    const requirements = activity.requirements && activity.requirements.length > 0 ? 
        activity.requirements : 
        [
            "Minimum age: 8 years",
            "Good physical condition",
            "Swimwear and towel",
            "Sunscreen and sunglasses",
            "Comfortable clothing"
        ];
    
    // Location coordinates for the map (mock data)
    const mapCoordinates = {
        lat: 4.1755 + (Math.random() * 0.05),
        lng: 73.5093 + (Math.random() * 0.05)
    };

    return (
        <div className="bg-platinum-500 rounded-lg shadow-md overflow-hidden">
            {/* Tabs Navigation */}
            <div className="flex border-b border-ash_gray-300">
                <button 
                    className={`px-4 py-3 text-sm font-medium ${activeTab === 'description' ? 'text-lapis_lazuli-500 border-b-2 border-lapis_lazuli-500' : 'text-ash_gray-400 hover:text-lapis_lazuli-400'}`}
                    onClick={() => setActiveTab('description')}
                >
                    Description
                </button>
                <button 
                    className={`px-4 py-3 text-sm font-medium ${activeTab === 'inclusions' ? 'text-lapis_lazuli-500 border-b-2 border-lapis_lazuli-500' : 'text-ash_gray-400 hover:text-lapis_lazuli-400'}`}
                    onClick={() => setActiveTab('inclusions')}
                >
                    Inclusions
                </button>
                <button 
                    className={`px-4 py-3 text-sm font-medium ${activeTab === 'requirements' ? 'text-lapis_lazuli-500 border-b-2 border-lapis_lazuli-500' : 'text-ash_gray-400 hover:text-lapis_lazuli-400'}`}
                    onClick={() => setActiveTab('requirements')}
                >
                    Requirements
                </button>
                <button 
                    className={`px-4 py-3 text-sm font-medium ${activeTab === 'location' ? 'text-lapis_lazuli-500 border-b-2 border-lapis_lazuli-500' : 'text-ash_gray-400 hover:text-lapis_lazuli-400'}`}
                    onClick={() => setActiveTab('location')}
                >
                    Location
                </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
                {activeTab === 'description' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-lapis_lazuli-500">About This Activity</h3>
                        <p className="text-indigo_dye-400 leading-relaxed">
                            {activity.description}
                        </p>
                        <p className="text-indigo_dye-400 leading-relaxed">
                            Experience the beauty of the Maldives with this amazing {activity.type.replace('-', ' ')} activity. 
                            Perfect for travelers looking to make unforgettable memories in one of the world's most beautiful destinations.
                        </p>
                        <p className="text-indigo_dye-400 leading-relaxed">
                            Our experienced guides will ensure your safety and enjoyment throughout the {activity.duration}-hour experience.
                            Don't forget to bring your camera to capture the stunning vistas and magical moments!
                        </p>
                    </div>
                )}
                
                {activeTab === 'inclusions' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-lapis_lazuli-500">What's Included</h3>
                        <ul className="space-y-2">
                            {inclusions.map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <svg className="h-5 w-5 text-ash_gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span className="text-indigo_dye-400">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {activeTab === 'requirements' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-lapis_lazuli-500">Requirements</h3>
                        <ul className="space-y-2">
                            {requirements.map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <svg className="h-5 w-5 text-lapis_lazuli-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span className="text-indigo_dye-400">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {activeTab === 'location' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-lapis_lazuli-500">Activity Location</h3>
                        <p className="text-indigo_dye-400 mb-4">
                            This activity takes place in {activity.location}, known for its stunning beaches and crystal clear waters.
                        </p>
                        
                        {/* Map Placeholder - In a real app, you'd use react-leaflet */}
                        <div className="border border-ash_gray-300 rounded-lg h-96 overflow-hidden relative bg-platinum-600">
                            <div className="absolute inset-0 flex justify-center items-center">
                                <div className="text-center">
                                    <p className="text-lapis_lazuli-600 font-medium mb-2">Map of {activity.location}</p>
                                    <p className="text-ash_gray-400 text-sm">Coordinates: {mapCoordinates.lat.toFixed(4)}, {mapCoordinates.lng.toFixed(4)}</p>
                                    <p className="text-ash_gray-300 text-xs mt-2">(In a real app, a map would be displayed here using react-leaflet)</p>
                                </div>
                            </div>
                            <div className="absolute bottom-4 right-4 bg-platinum-500 p-2 rounded-lg shadow-md">
                                <div className="flex items-center text-lapis_lazuli-500 text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo_dye-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    Activity starting point
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <h4 className="font-medium text-lapis_lazuli-500 mb-2">Meeting Point</h4>
                            <p className="text-indigo_dye-400">You'll meet our guide at the main lobby of your resort or a designated pickup point. Exact meeting instructions will be provided after booking.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityTabs;
