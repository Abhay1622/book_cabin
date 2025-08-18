// app/guest-area/reservation/edit/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, User, FileText } from 'lucide-react';
import Link from 'next/link';

interface Reservation {
  id: string;
  cabinName: string;
  numberOfGuests: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  currency: string;
  cabin?: {
    id: string;
    description?: string;
    guests: number;
  };
}

const EditReservationPage = () => {
  const router = useRouter();
  const params = useParams();
  const reservationId = params?.id as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [cabinDescription, setCabinDescription] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (reservationId) {
      fetchReservation();
    }
  }, [reservationId]);

  const fetchReservation = async () => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reservation');
      }
      const data = await response.json();
      setReservation(data.reservation);
      setNumberOfGuests(data.reservation.numberOfGuests);
      setCabinDescription(data.reservation.cabin?.description || '');
    } catch (err) {
      setError('Failed to load reservation');
      console.error('Error fetching reservation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!reservation) return;

    if (reservation.cabin && numberOfGuests > reservation.cabin.guests) {
      setError(`Number of guests cannot exceed cabin capacity (${reservation.cabin.guests})`);
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numberOfGuests,
          cabinDescription,
          cabinId: reservation.cabin?.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Reservation updated successfully!');
        router.push('/guest-area/reservation'); 
      } else {
        setError(data.error || 'Failed to update reservation');
      }
    } catch (err) {
      setError('Failed to connect to server. Please try again.');
      console.error('Error updating reservation:', err);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1419] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-[#0F1419] flex items-center justify-center">
        <div className="text-white">Reservation not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/guest-area">
            <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Edit Reservation</h1>
        </div>

        <div className="bg-[#141C24] border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">{reservation.cabinName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Check-in:</span>
              <p className="text-white">{formatDate(reservation.startDate)}</p>
            </div>
            <div>
              <span className="text-slate-400">Check-out:</span>
              <p className="text-white">{formatDate(reservation.endDate)}</p>
            </div>
            <div>
              <span className="text-slate-400">Total Price:</span>
              <p className="text-[#D2AF6B] font-semibold">
                {reservation.totalPrice} {reservation.currency}
              </p>
            </div>
            {reservation.cabin && (
              <div>
                <span className="text-slate-400">Max Capacity:</span>
                <p className="text-white">{reservation.cabin.guests} guests</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#141C24] border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Update Details</h3>
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-slate-300 text-sm font-medium mb-2">
                <User size={16} />
                Number of Guests
              </label>
              <input
                type="number"
                min="1"
                max={reservation.cabin?.guests || 10}
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D2AF6B] focus:border-transparent"
              />
              {reservation.cabin && (
                <p className="text-slate-400 text-xs mt-1">
                  Maximum capacity: {reservation.cabin.guests} guests
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-slate-300 text-sm font-medium mb-2">
                <FileText size={16} />
                Cabin Description / Special Requests
              </label>
              <textarea
                value={cabinDescription}
                onChange={(e) => setCabinDescription(e.target.value)}
                placeholder="Add any special requests or update cabin description..."
                rows={4}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D2AF6B] focus:border-transparent resize-vertical"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Link href="/guest-area">
              <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                Cancel
              </button>
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-[#D2AF6B] hover:bg-[#C19B5A] disabled:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditReservationPage;