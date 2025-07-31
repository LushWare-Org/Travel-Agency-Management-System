import React from 'react';

const ActivityInfo = ({ activity }) => {
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-lapis_lazuli-500 mb-2 font-display">{activity.title}</h1>
                    {/* Review section removed as requested */}
                    <div className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{activity.location}</span>
                    </div>
                </div>
                
                <div className="mt-4 md:mt-0 bg-platinum-500 p-4 rounded-lg">
                    <div className="text-indigo_dye-500 mb-2">
                        <span className="font-medium">Duration:</span> {activity.duration} hour{activity.duration !== 1 ? 's' : ''}
                    </div>
                    <div className="text-indigo_dye-500">
                        <span className="font-medium">Type:</span> {activity.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityInfo;
