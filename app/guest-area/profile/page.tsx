'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Mail, Globe, CreditCard, Edit2, Save, X } from 'lucide-react';


interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  country?: string;
  nationalId?: string;
  totalReservations: number;
  completedStays: number;
  createdAt: string;
}

interface ProfileFormData {
  country: string;
  nationalId: string;
}

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'China', 'Colombia',
  'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Ghana',
  'Greece', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Italy', 'Japan', 'Jordan', 'Kenya', 'Kuwait', 'Lebanon',
  'Malaysia', 'Mexico', 'Nepal', 'Netherlands', 'New Zealand', 'Nigeria',
  'Norway', 'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Qatar',
  'Russia', 'Saudi Arabia', 'Singapore', 'South Africa', 'South Korea', 'Spain',
  'Sri Lanka', 'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'UAE',
  'Ukraine', 'United Kingdom', 'United States', 'Vietnam'
];

export default function UserProfile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    country: '',
    nationalId: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.email) return;
      
      try {
        setLoading(true);
        
        
        const mockProfile: UserProfile = {
          id: '1',
          name: session.user.name || 'John Doe',
          email: session.user.email,
          image: session.user.image || '',
          country: '',
          nationalId: '',
          totalReservations: 3,
          completedStays: 1,
          createdAt: '2023-01-15T00:00:00Z'
        };
        
        setProfile(mockProfile);
        setFormData({
          country: mockProfile.country || '',
          nationalId: mockProfile.nationalId || ''
        });
        
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      
      setProfile(prev => prev ? {
        ...prev,
        ...formData
      } : null);
      
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        country: profile.country || '',
        nationalId: profile.nationalId || ''
      });
    }
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141C24] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#141C24] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-2">Profile not found</p>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141C24] px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1F2937] rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
            <div className="absolute bottom-0 left-6 transform translate-y-1/2">
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-300">
                {session?.user?.image ? (
                  <img
                    src={session?.user?.image}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-500">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-6 px-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                <p className="text-gray-400">{profile.email}</p>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-[#1F2937] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Name - Read Only */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#2A3A47] border border-gray-600 rounded-lg text-gray-300">
                    <User className="w-4 h-4 text-blue-400" />
                    <span>{profile.name}</span>
                  </div>
                </div>

                {/* Email - Read Only */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#2A3A47] border border-gray-600 rounded-lg text-gray-300">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>{profile.email}</span>
                  </div>
                </div>

                {/* Country - Editable */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 pl-10 bg-[#2A3A47] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        required
                      >
                        <option value="">Select your country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#2A3A47] border border-gray-600 rounded-lg text-gray-300">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span>{profile.country || 'Not selected'}</span>
                    </div>
                  )}
                </div>

                {/* National ID - Editable */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    National ID Number
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="text"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 pl-10 bg-[#2A3A47] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your national ID number"
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#2A3A47] border border-gray-600 rounded-lg text-gray-300">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      <span>{profile.nationalId || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Account Stats */}
            <div className="bg-[#1F2937] rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Account Stats</h2>
              
              <div className="space-y-4">
                <div className="bg-[#2A3A47] p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{profile.totalReservations}</div>
                  <div className="text-gray-300 text-sm">Total Reservations</div>
                </div>
                
                <div className="bg-[#2A3A47] p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{profile.completedStays}</div>
                  <div className="text-gray-300 text-sm">Completed Stays</div>
                </div>
                
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-[#1F2937] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Completion</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Basic Info</span>
                  <span className="text-green-400 text-sm">✓ Complete</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Country</span>
                  <span className={`text-sm ${profile.country ? 'text-green-400' : 'text-yellow-400'}`}>
                    {profile.country ? '✓ Complete' : '⚠ Missing'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">National ID</span>
                  <span className={`text-sm ${profile.nationalId ? 'text-green-400' : 'text-yellow-400'}`}>
                    {profile.nationalId ? '✓ Complete' : '⚠ Missing'}
                  </span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{
                        width: `${33.33 + (profile.country ? 33.33 : 0) + (profile.nationalId ? 33.33 : 0)}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    {Math.round(33.33 + (profile.country ? 33.33 : 0) + (profile.nationalId ? 33.33 : 0))}% Complete
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}