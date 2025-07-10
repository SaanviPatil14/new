import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiCalendar, FiAward, FiBarChart2, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      let endpoint = '';
      
      switch (user?.userType) {
        case 'admin':
          endpoint = '/api/admin/dashboard';
          break;
        case 'voter':
          endpoint = '/api/voters/dashboard';
          break;
        case 'candidate':
          endpoint = '/api/candidates/profile/me';
          break;
        default:
          break;
      }

      if (endpoint) {
        const response = await axios.get(endpoint);
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiUser className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiAward className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalCandidates || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiBarChart2 className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Votes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalVotes || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiCalendar className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Voter Turnout</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.voterTurnout || '0%'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/admin/candidates"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FiAward className="w-5 h-5 text-blue-600 mr-3" />
              <span>Manage Candidates</span>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FiUser className="w-5 h-5 text-green-600 mr-3" />
              <span>Manage Users</span>
            </Link>
            <Link
              to="/admin/votes"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FiBarChart2 className="w-5 h-5 text-purple-600 mr-3" />
              <span>View All Votes</span>
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Recent Registrations</p>
                <p className="text-sm text-gray-600">Last 7 days</p>
              </div>
              <span className="text-lg font-semibold text-blue-600">{stats?.recentRegistrations || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Recent Votes</p>
                <p className="text-sm text-gray-600">Last 24 hours</p>
              </div>
              <span className="text-lg font-semibold text-green-600">{stats?.recentVotes || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVoterDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiAward className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalCandidates || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiBarChart2 className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Votes Cast</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalVotes || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${stats?.hasVoted ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
              <FiCheckCircle className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Voting Status</p>
              <p className="text-lg font-semibold text-gray-900">
                {stats?.hasVoted ? 'Voted' : 'Not Voted'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {!stats?.hasVoted ? (
              <Link
                to="/vote"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <FiCheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span>Cast Your Vote</span>
              </Link>
            ) : (
              <div className="flex items-center p-3 rounded-lg bg-green-50 border border-green-200">
                <FiCheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span>You have already voted</span>
              </div>
            )}
            <Link
              to="/candidates"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FiAward className="w-5 h-5 text-blue-600 mr-3" />
              <span>View Candidates</span>
            </Link>
            <Link
              to="/results"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FiBarChart2 className="w-5 h-5 text-purple-600 mr-3" />
              <span>View Results</span>
            </Link>
          </div>
        </div>

        {stats?.myVote && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Vote</h3>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-2">You voted for:</p>
              <p className="font-semibold text-gray-900">{stats.myVote.candidate.name}</p>
              <p className="text-sm text-gray-600">{stats.myVote.candidate.party}</p>
              <p className="text-sm text-gray-600 mt-2">
                Voted on: {new Date(stats.myVote.votedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCandidateDashboard = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidate Profile</h3>
        {stats ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className={`font-semibold ${stats.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                  {stats.isApproved ? 'Approved' : 'Pending Approval'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Vote Count</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.voteCount || 0}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Party</p>
                <p className="font-semibold text-gray-900">{stats.party}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Position</p>
                <p className="font-semibold text-gray-900">{stats.position}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Manifesto</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{stats.manifesto}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You haven't registered as a candidate yet.</p>
            <Link to="/candidates/register" className="btn-primary">
              Register as Candidate
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/candidates/profile/me"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FiUser className="w-5 h-5 text-blue-600 mr-3" />
              <span>Update Profile</span>
            </Link>
            <Link
              to="/results"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FiBarChart2 className="w-5 h-5 text-purple-600 mr-3" />
              <span>View Results</span>
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FiUser className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FiMail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Username</p>
                <p className="text-sm text-gray-600">{user?.username}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.firstName}! Here's what's happening with your account.
        </p>
      </div>

      {user?.userType === 'admin' && renderAdminDashboard()}
      {user?.userType === 'voter' && renderVoterDashboard()}
      {user?.userType === 'candidate' && renderCandidateDashboard()}
    </div>
  );
};

export default Dashboard;
