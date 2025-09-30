import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, Users, Clock, MapPin, CreditCard as Edit3, Eye, LogOut, Search, Filter, Download, Plus, BarChart3, Settings } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { TrackingData } from '../contexts/TrackingContext';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, logout, parcels, setParcels, updateParcel, stats } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedParcel, setSelectedParcel] = useState<TrackingData | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    // Load demo parcels if none exist
    if (parcels.length === 0) {
      loadDemoParcels();
    }
  }, [isAuthenticated, navigate, parcels.length]);

  const loadDemoParcels = () => {
    const demoParcels: TrackingData[] = [
      {
        id: 'SWIFT-123456',
        sender: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street, San Francisco, CA 94102'
        },
        receiver: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1 (555) 987-6543',
          address: '456 Oak Avenue, Los Angeles, CA 90210'
        },
        parcelDetails: {
          description: 'Electronics and accessories',
          weight: '2-5kg',
          dimensions: { length: 30, width: 20, height: 15 },
          value: 299.99,
          instructions: 'Handle with care - fragile items'
        },
        status: 'in-transit',
        mode: 'auto',
        history: [
          {
            status: 'Package scheduled',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            location: 'San Francisco, CA',
            notes: 'Package scheduled for pickup'
          },
          {
            status: 'Package picked up',
            timestamp: new Date(Date.now() - 72000000).toISOString(),
            location: 'San Francisco, CA',
            notes: 'Package collected from sender'
          },
          {
            status: 'In transit',
            timestamp: new Date(Date.now() - 36000000).toISOString(),
            location: 'San Jose, CA',
            notes: 'Package in transit to destination'
          }
        ],
        route: [
          { lat: 37.7749, lng: -122.4194, label: 'San Francisco, CA' },
          { lat: 37.3382, lng: -121.8863, label: 'San Jose, CA' },
          { lat: 34.0522, lng: -118.2437, label: 'Los Angeles, CA' }
        ],
        currentPosition: { lat: 37.3382, lng: -121.8863 },
        eta: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        estimatedCost: 24.99,
        progress: 60
      },
      {
        id: 'SWIFT-789012',
        sender: {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          phone: '+1 (555) 234-5678',
          address: '789 Pine Street, Seattle, WA 98101'
        },
        receiver: {
          name: 'Bob Wilson',
          email: 'bob@example.com',
          phone: '+1 (555) 876-5432',
          address: '321 Elm Street, Portland, OR 97201'
        },
        parcelDetails: {
          description: 'Books and documents',
          weight: '1-5kg',
          dimensions: { length: 25, width: 15, height: 10 },
          value: 89.99,
          instructions: 'Standard delivery'
        },
        status: 'delivered',
        mode: 'manual',
        history: [
          {
            status: 'Package scheduled',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            location: 'Seattle, WA',
            notes: 'Package scheduled for pickup'
          },
          {
            status: 'Package picked up',
            timestamp: new Date(Date.now() - 158400000).toISOString(),
            location: 'Seattle, WA',
            notes: 'Package collected from sender'
          },
          {
            status: 'Delivered',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            location: 'Portland, OR',
            notes: 'Package delivered successfully'
          }
        ],
        route: [
          { lat: 47.6062, lng: -122.3321, label: 'Seattle, WA' },
          { lat: 45.5152, lng: -122.6784, label: 'Portland, OR' }
        ],
        currentPosition: { lat: 45.5152, lng: -122.6784 },
        eta: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        estimatedCost: 18.99,
        progress: 100
      }
    ];

    setParcels(demoParcels);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const filteredParcels = parcels.filter(parcel => {
    const matchesSearch = parcel.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parcel.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parcel.receiver.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || parcel.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleUpdateParcel = (parcel: TrackingData) => {
    setSelectedParcel(parcel);
    setShowUpdateModal(true);
  };

  const handleSaveUpdate = (updates: Partial<TrackingData>) => {
    if (selectedParcel) {
      updateParcel(selectedParcel.id, updates);
      toast.success('Parcel updated successfully');
      setShowUpdateModal(false);
      setSelectedParcel(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'picked-up':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'in-transit':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'at-hub':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'out-for-delivery':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Swiftify Admin
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Logistics Management Dashboard
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'parcels', name: 'Parcels', icon: Package },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Parcels</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalParcels}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
                    <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">In Transit</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.inTransit}</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">On-Time Rate</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.onTimeDelivery}%</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {parcels.slice(0, 5).map((parcel) => (
                  <div key={parcel.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Package className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{parcel.id}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {parcel.sender.name} → {parcel.receiver.name}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(parcel.status)}`}>
                      {parcel.status.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Parcels Tab */}
        {activeTab === 'parcels' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by tracking ID, sender, or receiver..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="picked-up">Picked Up</option>
                      <option value="in-transit">In Transit</option>
                      <option value="at-hub">At Hub</option>
                      <option value="out-for-delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Parcels Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tracking ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Sender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Receiver
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Mode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredParcels.map((parcel) => (
                      <tr key={parcel.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {parcel.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{parcel.sender.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{parcel.sender.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{parcel.receiver.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{parcel.receiver.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(parcel.status)}`}>
                            {parcel.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            parcel.mode === 'auto' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {parcel.mode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(parcel.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/track?id=${parcel.id}`)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateParcel(parcel)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Analytics Dashboard
              </h3>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Advanced analytics and reporting features coming soon
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                System Settings
              </h3>
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Configuration and system settings panel
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {showUpdateModal && selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Update Parcel: {selectedParcel.id}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  defaultValue={selectedParcel.status}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="picked-up">Picked Up</option>
                  <option value="in-transit">In Transit</option>
                  <option value="at-hub">At Hub</option>
                  <option value="out-for-delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mode
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mode"
                      value="auto"
                      defaultChecked={selectedParcel.mode === 'auto'}
                      className="mr-2"
                    />
                    <span className="text-gray-900 dark:text-white">Auto</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mode"
                      value="manual"
                      defaultChecked={selectedParcel.mode === 'manual'}
                      className="mr-2"
                    />
                    <span className="text-gray-900 dark:text-white">Manual</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Add update notes..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveUpdate({ status: 'in-transit' })}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;