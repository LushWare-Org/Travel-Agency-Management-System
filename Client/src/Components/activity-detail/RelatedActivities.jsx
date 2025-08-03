import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityCard from '../ActivityCard';

const RelatedActivities = ({ activities }) => {
    if (!activities || activities.length === 0) {
        return null;
    }

    const navigate = useNavigate();

    return (
        <div>
            <h2 className="text-2xl font-bold text-lapis_lazuli-500 mb-6 font-display">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {activities.map(activity => (
                    <div key={activity._id} onClick={() => navigate(`/activities/${activity._id}`)}>
                        <ActivityCard activity={activity} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedActivities;
