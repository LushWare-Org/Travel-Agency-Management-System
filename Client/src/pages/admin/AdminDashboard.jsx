import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../Components/AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout title="Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/activities"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-swimming-pool text-2xl text-blue-600"></i>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Activities
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Manage Activities
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                View all activities
              </span>
            </div>
          </div>
        </Link>

        {/* Add other admin sections here */}
        <div className="bg-white overflow-hidden shadow rounded-lg opacity-50">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-hotel text-2xl text-gray-400"></i>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Hotels
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Coming Soon
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg opacity-50">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-users text-2xl text-gray-400"></i>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Coming Soon
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
