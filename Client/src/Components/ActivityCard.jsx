// Components/ActivityCard.jsx
import React from 'react';

const ActivityCard = ({ activity, onClick }) => (
  <div
    className="rounded-3xl bg-platinum-500 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-platinum-400"
    onClick={onClick}
  >
    <div className="relative h-56 sm:h-64">
      <div className="absolute inset-0 bg-gradient-to-t from-indigo_dye-500/70 to-transparent z-10" />
      <img
        src={activity.image}
        alt={activity.title}
        className="w-full h-full object-cover"
      />
      {activity.featured && (
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-lapis_lazuli-500 text-platinum-500 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full z-20">
          Featured
        </div>
      )}
      {activity.type && (
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
            ${activity.type === 'water-sports' ? 'bg-blue-100 text-blue-800 border border-blue-200' : ''}
            ${activity.type === 'cruises' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : ''}
            ${activity.type === 'island-tours' ? 'bg-green-100 text-green-800 border border-green-200' : ''}
            ${activity.type === 'diving' ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' : ''}
            ${activity.type === 'cultural' ? 'bg-purple-100 text-purple-800 border border-purple-200' : ''}
            ${activity.type === 'adventure' ? 'bg-orange-100 text-orange-800 border border-orange-200' : ''}
            ${activity.type === 'wellness' ? 'bg-pink-100 text-pink-800 border border-pink-200' : ''}
            ${activity.type === 'water' ? 'bg-blue-100 text-blue-800 border border-blue-200' : ''}
            ${activity.type === 'excursion' ? 'bg-green-100 text-green-800 border border-green-200' : ''}
            ${activity.type === 'dining' ? 'bg-purple-100 text-purple-800 border border-purple-200' : ''}
            ${!['water-sports', 'cruises', 'island-tours', 'diving', 'cultural', 'adventure', 'wellness', 'water', 'excursion', 'dining'].includes(activity.type) ? 'bg-gray-100 text-gray-800 border border-gray-200' : ''}
          `}>
            {activity.type.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-20">
        <h4 className="font-bold text-lg sm:text-xl text-platinum-500 line-clamp-1">{activity.title}</h4>
        <p className="text-platinum-400 text-xs sm:text-sm flex items-center">
          <svg className="h-3 sm:h-4 w-3 sm:w-4 mr-1 text-platinum-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {activity.location}
        </p>
      </div>
    </div>
    <div className="p-4 sm:p-5">
      <p className="text-indigo_dye-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
        {activity.shortDescription || activity.description}
      </p>
      
      {activity.duration && (
        <div className="flex items-center mb-2 sm:mb-3 text-ash_gray-400 text-xs sm:text-sm">
          <svg className="h-3 sm:h-4 w-3 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {activity.duration}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-ash_gray-400">
        <div className="flex items-center mb-1">
          <span className="text-lg sm:text-xl font-bold text-lapis_lazuli-500">
            ${activity.price?.toFixed(2) || '0.00'}
          </span>
          <span className="text-xs sm:text-sm text-ash_gray-400 ml-1">/person</span>
        </div>
        <div className="bg-ash_gray-500 hover:bg-ash_gray-600 rounded-full px-3 sm:px-4 py-1 transition-colors duration-300 min-h-[36px] flex items-center">
          <span className="text-lapis_lazuli-500 font-medium text-xs sm:text-sm">View Details</span>
        </div>
      </div>
    </div>
  </div>
);

export default ActivityCard;
