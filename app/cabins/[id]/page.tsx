import React from 'react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ReservationBooking from '@/components/CabinsReservation';

interface CabinDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const CabinDetailPage = async ({ params }: CabinDetailPageProps) => {
  const { id } = await params;

  if (!id || typeof id !== 'string') {
    notFound();
  }

  const cabin = await prisma.cabin.findUnique({
    where: {
      id,
    },
  });

  if (!cabin) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#141C24] pt-30 ">
      <hr className='mb-2 text-gray-500 w-full' />
      <div className="max-w-6xl mx-auto px-6 pb-12 pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="relative h-96 lg:h-[500px] overflow-hidden">
            <Image
              src={cabin.image}
              alt={cabin.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="text-white space-y-6 py-20 border border-l-0 border-[#99ABB7] pl-10 relative">
            <div className='absolute top-2 -left-50 bg-[#141C24] p-4'>
              <h1 className="text-[72px] lg:text-5xl font-bold text-[#F4ECE1]">
                {cabin.name}
              </h1>
            </div>
            <div className="text-[#99ABB7]">
              <p className="text-lg leading-relaxed pt-3">
                Discover the ultimate luxury getaway for couples in the cozy wooden {cabin.name.toLowerCase()}.
                Nestled in a picturesque forest, this stunning cabin offers a secluded and intimate retreat.
                Inside, enjoy modern high-quality wood interiors, a comfortable seating area, a fireplace and...
                <span className="text-[#99ABB7] cursor-pointer hover:underline ml-2">
                  Show more
                </span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <svg className="w-5 h-5 text-[#99ABB7]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-lg text-[#99ABB7]">For up to <strong>{cabin.guests}</strong> guests</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <svg className="w-5 h-5 text-[#99ABB7]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">Located in the heart of the <strong>Dolomites</strong> (Italy)</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <svg className="w-5 h-5 text-[#99ABB7]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">Privacy <strong>100%</strong> guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ReservationBooking cabinsName={cabin.name} guests={cabin.guests} />
      </div>
    </div>
  );
};

export default CabinDetailPage;