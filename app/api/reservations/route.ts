import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        userEmail: session.user.email,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


export async function POST(request: NextRequest) {
  try {
    console.log('API Route: Creating new reservation...');
    
    const body = await request.json();
    console.log('Received reservation data:', body);
    
    const {
      cabinName,
      userId,
      userEmail,
      startDate,
      endDate,
      cabinImage,
      numberOfGuests,
      numberOfNights,
      pricePerNight,
      totalPrice,
      currency,
      specialRequests
    } = body;

    if (!cabinName || !userEmail || !startDate || !endDate || !numberOfGuests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (startDateObj >= endDateObj) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDateObj < today) {
      return NextResponse.json(
        { error: 'Start date cannot be in the past' },
        { status: 400 }
      );
    }

    const existingReservation = await prisma.reservation.findFirst({
      where: {
        cabinName,
        status: 'confirmed',
        AND: [
          {
            startDate: {
              lte: endDateObj,
            },
          },
          {
            endDate: {
              gte: startDateObj,
            },
          },
        ],
      },
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: 'The cabin is already booked for the selected dates' },
        { status: 409 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        cabinName,
        userId: userId || '', 
        userEmail,
        startDate: startDateObj,
        endDate: endDateObj,
        numberOfGuests: parseInt(numberOfGuests),
        numberOfNights: parseInt(numberOfNights),
        pricePerNight: parseInt(pricePerNight),
        totalPrice: parseInt(totalPrice),
        currency: currency || 'INR',
        specialRequests: specialRequests || null,
        status: 'confirmed',
      },
    });

    console.log('Reservation created successfully:', reservation);

    return NextResponse.json(
      { 
        message: 'Reservation created successfully',
        reservation: reservation
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating reservation:', error);
    
    
    return NextResponse.json(
      { 
        error: 'Internal server error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}