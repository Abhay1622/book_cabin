'use client'
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface ReservationBookingProps {
  cabinsName: string
  guests: number
}

const ReservationBooking: React.FC<ReservationBookingProps> = ({ cabinsName, guests }: ReservationBookingProps,) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 7));
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedGuests, setSelectedGuests] = useState<number>(0);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [guestsNumber , setGuestsNumber] = useState<any>([])

  useEffect(()=>{
    let arr = [];
    for(let i=1; i<=guests; i++){
      arr.push(i);
    }
    setGuestsNumber(arr);
  },[])

  const pricePerNight: number = 2500;
  const currency: string = 'INR';

  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const isMonthSelectable = (date: Date): boolean => {
    const minDate = new Date(2025, 7);
    return date >= minDate;
  };

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const navigateMonth = (direction: number): void => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      if (isMonthSelectable(newMonth)) {
        return newMonth;
      }
      return prev;
    });
  };

  const getNextMonth = (): Date => {
    const next = new Date(currentMonth);
    next.setMonth(currentMonth.getMonth() + 1);
    return next;
  };

  const isDateInRange = (day: number | null, month: Date): boolean => {
    if (!startDate || !day) return false;
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    if (!endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isStartDate = (day: number | null, month: Date): boolean => {
    if (!startDate || !day) return false;
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    return date.getTime() === startDate.getTime();
  };

  const isEndDate = (day: number | null, month: Date): boolean => {
    if (!endDate || !day) return false;
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    return date.getTime() === endDate.getTime();
  };

  const handleDateClick = (day: number | null, month: Date) => {
    if (!day) return;
    const clickedDate = new Date(month.getFullYear(), month.getMonth(), day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (clickedDate < today) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else {
      if (clickedDate < startDate) {
        setEndDate(startDate);
        setStartDate(clickedDate);
      } else {
        setEndDate(clickedDate);
      }
    }
  };

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const calculateTotal = () => calculateNights() * pricePerNight;

  const clearSelection = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleReservation = async () => {
    if (!startDate || !endDate || selectedGuests === 0) {
      alert('Please select dates and number of guests');
      return;
    }

    // Updated: Added session null check
    if (!session) {
      alert('Please log in to make a reservation');
      return;
    }

    setIsSubmitting(true);

    try {
      const reservationData = {
        cabinName: cabinsName,
        userId: session.user?.id || '',
        userEmail: session.user?.email || '',
        startDate: startDate.toISOString(),
        cabinImage : `/${cabinsName}`,
        endDate: endDate.toISOString(),
        numberOfGuests: selectedGuests,
        numberOfNights: calculateNights(),
        pricePerNight: pricePerNight,
        totalPrice: calculateTotal(),
        currency: currency,
        specialRequests: specialRequests || null
      };

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Reservation created successfully!');
        setStartDate(null);
        setEndDate(null);
        setSelectedGuests(0);
        setSpecialRequests('');
      } else {
        const error = await response.json();
        alert('Failed to create reservation: ' + error.message);
      }
    } catch (error) {
      alert('An error occurred while creating the reservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCalendar = (month: Date) => {
    const days = getDaysInMonth(month);
    const monthName = monthNames[month.getMonth()];
    const year = month.getFullYear();

    return (
      <div className="flex-1">
        <div className="flex items-center justify-center mb-4">
          <h3 className="text-white font-medium text-lg">
            {monthName} {year}
          </h3>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-gray-400 text-sm text-center py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 ">
          {days.map((day, index) => {
            if (!day) return <div key={index} className="h-10" />;

            const date = new Date(month.getFullYear(), month.getMonth(), day);
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
            const inRange = isDateInRange(day, month);
            const isStart = isStartDate(day, month);
            const isEnd = isEndDate(day, month);

            return (
              <button
                key={index}
                onClick={() => !isPast && handleDateClick(day, month)}
                disabled={isPast}
                className={`
                  h-10 w-10 text-sm font-medium rounded-full relative flex items-center justify-center
    focus:outline-none focus:ring-2 focus:ring-[#C69963] focus:ring-opacity-60
                  ${isPast
                    ? 'text-gray-600 opacity-50 cursor-not-allowed'
                    : 'text-white hover:bg-amber-600 cursor-pointer'
                  }
                  ${inRange && !isPast
                    ? isStart || isEnd
                      ? 'bg-amber-500 text-black font-bold z-10'
                      : 'bg-[#C69963] text-black'
                    : ''
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#141C24] min-h-screen p-4 md:p-8 ">
      <h1 className="text-3xl md:text-4xl font-light text-[#C69963] text-center mb-6">
        Reserve today {cabinsName}. Pay on arrival.
      </h1>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        <div className="flex-1 bg-[#141C24] p-6 shadow-2xl border border-[#99ABB7] flex flex-col min-h-[500px]">

          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth(-1)}
              disabled={(() => {
                const prev = new Date(currentMonth);
                prev.setMonth(prev.getMonth() - 1);
                return !isMonthSelectable(prev);
              })()}
              className="text-[#C69963]  p-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-4 flex-1 justify-center">
              {renderCalendar(currentMonth)}
              {isMonthSelectable(getNextMonth()) && renderCalendar(getNextMonth())}
            </div>

            <button
              onClick={() => navigateMonth(1)}
              className="text-[#C69963] p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-[#C69963] text-black px-4 py-2 rounded-lg">
                <span className="text-xl font-bold">{pricePerNight}</span>
                <span className="text-sm ml-1">{currency}/night</span>
              </div>

              {calculateNights() > 0 && (
                <>
                  <span className="text-gray-400 text-lg">×</span>
                  <span className="text-white text-lg">{calculateNights()} nights</span>
                  <div className="bg-slate-700 px-4 py-2 rounded-lg">
                    <span className="text-white text-sm">TOTAL </span>
                    <span className="text-[#C69963] text-xl font-bold">
                      {calculateTotal()} {currency}
                    </span>
                  </div>
                </>
              )}

              {(startDate || endDate) && (
                <button
                  onClick={clearSelection}
                  className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded text-sm transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#141C24] border border-[#99ABB7]  shadow-2xl flex flex-col min-h-[500px]">
          {!session ? (
            <div className="flex flex-col justify-center h-full p-6">
              <h2 className="text-2xl font-semibold text-[#C69963] mb-4">Secure Your Stay</h2>
              <p className="text-gray-200 leading-relaxed mb-4">
                To reserve this cabin, please{' '}
                <Link href="/login">
                  <span className="text-[#C69963] font-medium underline">log in</span>
                </Link>{' '}
                or create an account.
              </p>
              <p className="text-gray-300 text-sm">
                No payment required now — pay directly at arrival. Your reservation will be confirmed instantly.
              </p>
            </div>
          ) : (
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-2 p-2 bg-[#2C3D4F]">
                  <div className="text-slate-300 text-lg">Logged in as</div>
                  <div className="flex items-center gap-3">
                    {session?.user?.image ? (
                      <img
                        src={session?.user?.image}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {session?.user?.name?.[0]?.toUpperCase() ||
                          session?.user?.email?.[0]?.toUpperCase() ||
                          '👤'}
                      </div>
                    )}
                    <span className="text-slate-300 text-lg">
                      {session?.user?.name || session?.user?.email}
                    </span>
                  </div>
                </div>

                <div className=" p-6">
                  <label className="block text-white text-xl font-medium mb-4">
                    How many guests?
                  </label>
                  <select
                    value={selectedGuests}
                    onChange={(e) => setSelectedGuests(Number(e.target.value))}
                    className="w-full bg-slate-600 text-white border border-slate-500 rounded px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select number of guests...</option>
                    {guestsNumber.map((val : any)=>(
                      <option key={val} value={val}>{val}{val==1 ? " Guest" : " Guests"}</option>
                    ))}
                  </select>
                </div>

                <div className=" p-6">
                  <label className="block text-white text-xl font-medium mb-4">
                    Anything we should know about your stay?
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any pets, allergies, special requirements, etc.?"
                    className="w-full bg-slate-600 text-white border border-slate-500 rounded px-4 py-3 text-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <button 
                onClick={handleReservation}
                disabled={isSubmitting || !startDate || !endDate || selectedGuests === 0}
                className="bg-[#C69963] ml-6 mb-4 text-slate-800 font-semibold px-8 py-3 rounded text-lg transition-colors duration-200 self-start disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Reservation...' : 'Reserve now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationBooking;