
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Reservation } from '@/types/reservation';
import Image from 'next/image';
import Link from 'next/link';

interface ReservationProps {
  reservation: Reservation;
}

const ReservationComponent: React.FC<ReservationProps> = ({ reservation }) => {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDateRange = (startDate: Date | string, endDate: Date | string) => {
    const options = {
      month: 'short',
      day: '2-digit',
    } as const;
    const start = new Date(startDate).toLocaleDateString('en-US', options);
    const end = new Date(endDate).toLocaleDateString('en-US', options);
    return `${start} — ${end}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
      case 'confirmed':
        return 'bg-green-700 text-green-100';
      case 'pending':
        return 'bg-yellow-700 text-yellow-100';
      case 'cancelled':
        return 'bg-red-700 text-red-100';
      case 'past':
        return 'bg-slate-600 text-slate-200';
      default:
        return 'bg-slate-600 text-slate-200';
    }
  };

  const isFutureBooking = () => {
    const currentDate = new Date();
    const bookingStartDate = new Date(reservation.startDate);
    return bookingStartDate > currentDate;
  };

  const shouldShowButtons = isFutureBooking();

  const handleDeleteReservation = async () => {
  if (!window.confirm("Are you sure you want to delete this reservation?")) {
    return;
  }

  try {
    const res = await fetch(`/api/reservations/${reservation.id}`, {
      method: 'DELETE',
    });

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Non-JSON response:', text);
      alert('Server returned an error (check console).');
      return;
    }

    const data = await res.json();

    if (res.ok) {
      alert('✅ Reservation deleted successfully!');
      window.location.reload(); // Or update state
    } else {
      alert(`❌ Failed: ${data.error}`);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('❌ Failed to connect to server. Check your network or try again.');
  }
};



  return (
    <div className="flex flex-col gap-2 mb-[1rem] sm:flex-row w-full items-stretch border border-slate-700 bg-[#141C24] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-shrink-0 w-full sm:w-48 h-48 sm:h-auto relative">
        <Image
          src={reservation.cabin?.image }
          alt={reservation.cabinName}
          fill
          sizes="(max-width: 640px) 100vw, 192px"
          className="object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex-1 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
          <h3 className="text-base sm:text-lg font-medium text-white truncate max-w-full">
            {reservation.numberOfNights} nights in {reservation.cabinName}
          </h3>
          <span
            className={`px-2 py-1 rounded text-xs font-medium uppercase ${getStatusColor(
              reservation.status
            )} self-start sm:self-auto whitespace-nowrap`}
          >
            {reservation.status}
          </span>
        </div>

        <p className="text-slate-300 text-sm mb-3">
          {formatDateRange(reservation.startDate, reservation.endDate)}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm sm:text-base">
          <div className="flex items-center gap-3">
            <span className="text-[#D2AF6B] font-semibold">
              {reservation.totalPrice} {reservation.currency}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">{reservation.numberOfGuests} guest(s)</span>
          </div>
          <span className="text-slate-400 text-xs sm:ml-auto">
            Booked {formatDate(reservation.createdAt)}
          </span>
        </div>
      </div>

      {shouldShowButtons && (
        <div className="flex sm:flex-col gap-2 p-4 sm:p-5 border-t sm:border-t-0 sm:border-l border-slate-700">
          <Link href={`/guest-area/reservation/edit/${reservation.id}`}>
          <button
            className="flex items-center justify-center sm:justify-start gap-2 w-full bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-slate-300 hover:text-white transition-colors text-sm font-medium flex-1 sm:flex-initial"
            aria-label="Edit reservation"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
          </Link>
          <button
            onClick={handleDeleteReservation}
            className="flex items-center justify-center sm:justify-start gap-2 bg-slate-700 hover:bg-red-600 px-3 py-2 rounded text-slate-300 hover:text-white transition-colors text-sm font-medium flex-1 sm:flex-initial"
            aria-label="Delete reservation"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReservationComponent;