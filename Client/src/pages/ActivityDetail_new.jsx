import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activitiesAPI } from '../services/activitiesAPI';

// Import all the activity detail components
import ActivityImageGallery from '../Components/activity-detail/ActivityImageGallery';
import ActivityInfo from '../Components/activity-detail/ActivityInfo';
import ActivityTabs from '../Components/activity-detail/ActivityTabs';
import BookingForm from '../Components/activity-detail/BookingForm';
import RelatedActivities from '../Components/activity-detail/RelatedActivities';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const data = await activitiesAPI.getById(id);
        setActivity(data);
      } catch (error) {
        console.error('Error fetching activity:', error);
        setError('Failed to load activity details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActivity();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activity details...</p>
        </div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-red-800 mb-4">Activity Not Found</h2>
            <p className="text-red-600 mb-6">{error || 'The activity you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/activities')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Activities
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section with Image Gallery */}
      <ActivityImageGallery activity={activity} />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Activity Info and Tabs */}
          <div className="lg:col-span-2">
            <ActivityInfo activity={activity} />
            <ActivityTabs activity={activity} />
          </div>
          
          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <BookingForm activity={activity} />
          </div>
        </div>
        
        {/* Related Activities */}
        <div className="mt-12">
          <RelatedActivities currentActivityId={id} activityType={activity.type} />
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
