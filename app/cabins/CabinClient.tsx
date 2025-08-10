'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Cabin {
    id: string;
    name: string;
    guests: number;
    price: number;
    originalPrice: number | null;
    image: string;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface CabinClientProps {
    cabins: Cabin[];
}

const CabinClient: React.FC<CabinClientProps> = ({ cabins }) => {
    const [activeTab, setActiveTab] = useState('all');
    

    const getFilteredCabins = () => {
        switch (activeTab) {
            case '1-3':
                return cabins.filter(cabin => cabin.guests >= 1 && cabin.guests <= 3);
            case '4-7':
                return cabins.filter(cabin => cabin.guests >= 4 && cabin.guests <= 7);
            case '8-12':
                return cabins.filter(cabin => cabin.guests >= 8 && cabin.guests <= 12);
            default:
                return cabins;
        }
    };

    const filteredCabins = getFilteredCabins();

    const tabs = [
        { id: 'all', label: 'All cabins' },
        { id: '1-3', label: '1-3 guests' },
        { id: '4-7', label: '4-7 guests' },
        { id: '8-12', label: '8-12 guests' }
    ];

    return (
        <div className="min-h-screen bg-[#141C24] pt-30 ">
            <hr className='mb-2 text-gray-500 w-full' />
            <div className=" py-12 w-full max-w-7xl mx-auto text-white ">
                <h2 className="text-4xl text-[#C69963] font-bold mb-4">
                    Escape to Nature in Our Luxury Mountain Cabins
                </h2>
                <p className="text-lg">
                    Luxurious cozy cabins set in a stunning natural landscape, surrounded by majestic mountains, towering palms, and a lush forest. Through high-quality images and interactive tours, guests can experience the tranquil beauty and rustic charm of the property, offering a peaceful retreat in the heart of nature. Enjoy nature's beauty in your own little home away from home. The perfect spot for a peaceful, calm vacation. Welcome to paradise.
                </p>
            </div>

            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                activeTab === tab.id
                                    ? 'bg-slate-600 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-[1rem]">
                    {filteredCabins.map((cabin) => (
                        <div
                            key={cabin.id}
                            className="bg-[#141C24] rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors"
                        >
                            <div className="flex">
                                <div className="w-48 relative flex-shrink-0">
                                    <Image
                                        src={cabin.image}
                                        alt={cabin.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#C69963] mb-2">
                                            {cabin.name}
                                        </h3>
                                        <div className="flex items-center text-slate-300 text-sm mb-4">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                            For up to {cabin.guests} guests
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-white">
                                                {cabin.price} INR
                                            </span>
                                            {cabin.originalPrice && (
                                                <span className="text-slate-400 line-through text-lg">
                                                    {cabin.originalPrice} INR
                                                </span>
                                            )}
                                            <span className="text-slate-400 text-sm">/ night</span>
                                        </div>
                                    </div>

                                    <Link href={`/cabins/${cabin.id}`}>
                                        <button className="mt-4 text-slate-300 hover:text-white text-sm font-medium flex items-center group cursor-pointer">
                                            Details & reservation
                                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCabins.length === 0 && (
                    <div className="text-center text-slate-400 py-12">
                        <p>No cabins found for the selected guest count.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CabinClient;