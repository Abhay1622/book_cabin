// app/api/seed-cabins/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cabinsData = [
      {
        id: '001',
        name: 'Cabin 001',
        guests: 2,
        price: 2500,
        originalPrice: null,
        image: '/cabin-001.webp',
      },
      {
        id: '002',
        name: 'Cabin 002',
        guests: 2,
        price: 3250,
        originalPrice: 4000,
        image: '/cabin-002.webp',
      },
      {
        id: '003',
        name: 'Cabin 003',
        guests: 4,
        price: 3000,
        originalPrice: null,
        image: '/cabin-003.webp',
      },
      {
        id: '004',
        name: 'Cabin 004',
        guests: 4,
        price: 4500,
        originalPrice: 5000,
        image: '/cabin-004.webp',
      },
      {
        id: '005',
        name: 'Cabin 005',
        guests: 6,
        price: 3500,
        originalPrice: null,
        image: '/cabin-005.webp',
      },
      {
        id: '006',
        name: 'Cabin 006',
        guests: 6,
        price: 7000,
        originalPrice: 8000,
        image: '/cabin-006.webp',
      },
      {
        id: '007',
        name: 'Cabin 007',
        guests: 8,
        price: 5000,
        originalPrice: 6000,
        image: '/cabin-007.webp',
      },
      {
        id: '008',
        name: 'Cabin 008',
        guests: 10,
        price: 14000,
        originalPrice: null,
        image: '/cabin-008.webp',
      },
      {
        id: '009',
        name: 'Cabin 009',
        guests: 8,
        price: 9200,
        originalPrice: null,
        image: '/cabin-009.webp', // 🔴 Fixed: was pointing to cabin-008
      },
      {
        id: '010',
        name: 'Cabin 010',
        guests: 2,
        price: 3800,
        originalPrice: null,
        image: '/cabin-010.webp', // 🔴 Fixed: was pointing to cabin-008
      },
    ];

    // Upsert each cabin by ID
    const upsertPromises = cabinsData.map((cabin) =>
      prisma.cabin.upsert({
        where: { id: cabin.id },
        update: cabin,
        create: cabin,
      })
    );

    await Promise.all(upsertPromises);

    return NextResponse.json({
      message: 'All cabins updated or created successfully!',
      count: cabinsData.length,
    });
  } catch (error) {
    console.error('Error seeding cabin data:', error);
    return NextResponse.json(
      { error: 'Failed to seed cabin data' },
      { status: 500 }
    );
  }
}